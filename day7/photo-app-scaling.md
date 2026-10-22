# SnapShare Scaling Plan

## 1. Assumptions & Estimates

**Starting Facts:** 10 million registered users, 10% active daily. Each active user uploads 1 photo and views 50 feed pages per day. Average photo is 2 MB; thumbnail is 50 KB.
_Peak multiplier assumption: Peak traffic is 5× the average._

**Calculations:**

- **Daily Active Users (DAU):** 10,000,000 × 0.10 = 1,000,000 DAU.
- **Total Daily Uploads:** 1,000,000 DAU × 1 photo = 1,000,000 uploads/day.
- **Total Daily Feed Views:** 1,000,000 DAU × 50 views = 50,000,000 views/day.
- **Storage per Photo Upload:** 2 MB + 50 KB = 2.05 MB.
- **Total Daily Storage:** 1,000,000 × 2.05 MB = 2.05 TB/day.

| Metric         | Average (per second) | Peak (5× Average)  | Annual Total        |
| :------------- | :------------------- | :----------------- | :------------------ |
| **Uploads**    | ~11.6 uploads/sec    | ~58 uploads/sec    | 365 million uploads |
| **Feed Views** | ~578.7 views/sec     | ~2,893.5 views/sec | 18.25 billion views |
| **Storage**    | 23.7 MB/sec          | 118.5 MB/sec       | ~748.25 TB / year   |

## 2. Workload Profile

The system is heavily **read-heavy**. There is a 50:1 ratio of feed views to photo uploads (50 million views vs. 1 million uploads). This means our design must prioritize fast data retrieval, utilizing aggressive caching strategies, Content Delivery Networks (CDNs) for static media, and database read replicas to handle the high volume of queries without overloading the primary write database.

## 3. Data Storage Strategy

Photos should **not** be stored inside the database. Relational databases are optimized for structured text and metadata, and storing large binary objects (BLOBs) inside them causes severe performance degradation, database bloat, and expensive backup processes. Instead, image files should be stored in dedicated **Object Storage** (like AWS S3), while the database only stores the metadata (e.g., the URL link to the object storage, timestamp, user ID).

## 4. Architecture Diagram

```text
       [ Users ]
           |
       (Requests)
           |
     [ CDN (Photos/Thumbs) ] <---------+
           |                           |
    [ Load Balancer ]                  |
           |                           |
    +------+------+               [ Object Storage ]
    |             |                    ^
[ App Server 1 ] [ App Server 2 ] -----+
    |             |                    |
    +------+------+               [ Queue ] ---> [ Worker ]
           |
    [ Memory Cache ]
           |
  +--------+--------+
  |                 |
[ DB Primary ] -> [ DB Read Replica ]
  (Writes)          (Reads)
```
