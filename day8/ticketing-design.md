# TicketHub System Design

## 1. Requirements

- **Functional Requirements:**
  - Users can browse upcoming events and view available seats.
  - Users can select and temporarily "hold" a seat so it cannot be taken while they enter payment info.
  - Users can purchase tickets and view their purchased tickets.
- **Non-Functional Requirements:**
  - **Speed/Availability:** The site must remain responsive even during massive traffic spikes.
  - **Correctness (Strict Consistency):** The system must absolutely guarantee that a single seat cannot be sold to two different people.
  - **Fairness:** High-demand sales should utilize a first-come, first-served queue system so bots or people with faster internet don't monopolize the tickets.

## 2. Traffic Estimates

**Normal Day Traffic:**

- 50,000 visitors × 10 pages = 500,000 page views / day (~6 views/second).
- 5,000 tickets sold / day (~0.05 sales/second).

**Peak "Big Sale" Traffic (10-minute window):**

- 200,000 visitors trying to access the site in 600 seconds. Assuming they view 5 pages each trying to buy, that is 1,000,000 views / 10 minutes (~1,666 views/second).
- 200,000 people attempting to buy 20,000 seats in 600 seconds (~333 purchase attempts/second).
- _Comparison:_ Read traffic spikes by ~275x, and write/purchase traffic spikes by over 6,600x compared to a normal day.

## 3. API Design

| Method | Path                 | Description                                                   | Success Status |
| :----- | :------------------- | :------------------------------------------------------------ | :------------- |
| `GET`  | `/events`            | Browse a list of all upcoming concerts.                       | 200 OK         |
| `GET`  | `/events/:id/seats`  | View the seating chart and availability for a specific event. | 200 OK         |
| `POST` | `/seats/:id/hold`    | Temporarily lock a seat for 5 minutes for checkout.           | 200 OK         |
| `POST` | `/orders`            | Submit payment and finalize the purchase of held seats.       | 201 Created    |
| `GET`  | `/users/:id/tickets` | View a user's purchased tickets.                              | 200 OK         |

## 4. Data Model

- **users:** `id` (PK), `email`, `password_hash`
- **events:** `id` (PK), `title`, `date`, `venue_name`
- **seats:** `id` (PK), `event_id` (FK), `seat_number`, `status` (available, held, sold), `user_id` (FK - who holds/owns it), `hold_expires_at`
- **orders:** `id` (PK), `user_id` (FK), `total_amount`, `status`, `created_at`

**Relationships:**

- `events` has a One-to-Many relationship with `seats`.
- `users` has a One-to-Many relationship with `orders`.
- `orders` has a One-to-Many relationship with `seats` (a user can buy multiple seats in one order).

## 5. Preventing Double-Booking (Concurrency Control)

To prevent two people from buying the same seat at the exact same millisecond, we rely on **Database Transactions** and **Row-Level Locks**.
When User A tries to hold a seat, the backend executes an atomic SQL query:
`UPDATE seats SET status = 'held', user_id = 1 WHERE id = 99 AND status = 'available';`
Because databases process row updates sequentially and lock the row during the update, if User B's request hits a millisecond later, the `status` is already 'held', the `WHERE` clause fails to find an 'available' seat, and User B safely receives an "already taken" error.

## 6. Architecture Diagram

```text
       [ Users ]
           |
    [ Virtual Waiting Room / Queue ]
           |
       [ CDN ] (Static assets)
           |
    [ Load Balancer ]
           |
    +------+------+
    |             |
[ App Server ] [ App Server ]
    |             |
    +------+------+
           |
    +------+---------------+
    |                      |
[ Cache (Redis) ]    [ DB Primary (Writes) ]
 (Event Details)           |
                     [ DB Read Replica ]

```
