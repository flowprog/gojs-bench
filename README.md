# gojs-bench

The test machines are two LAN machines: one Windows 11 with AMD Ryzen CPU and 32GB RAM, one Linux with Intel Pentium CPU and 8GB RAM.
The database is PostgreSQL, installed on the Linux machine with a default max connections of 100.
The Go service is based on the GoFrame framework with its built-in ORM, connection pool max idle connections: 20, connection pool max open connections: 50
The bun.ts service uses the Elysia.js framework with bun's built-in pgsql without third-party ORM, max connections is bun's default of 10.

First, test both services running on the Windows machine, execute wrk from Linux, run for 20s:
## windows-go:
wrk -t4 -c100 -d20s http://192.168.5.187:8000/api/teacher/list 
Running 20s test @ http://192.168.5.187:8000/api/teacher/list
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    27.60ms   10.57ms 323.51ms   87.95%
    Req/Sec     0.92k    90.15     1.07k    82.38%
  73341 requests in 20.06s, 59.10MB read
Requests/sec:   3656.04
Transfer/sec:      2.95MB

wrk -t4 -c150 -d20s http://192.168.5.187:8000/api/teacher/list
Running 20s test @ http://192.168.5.187:8000/api/teacher/list
  4 threads and 150 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    41.29ms   20.00ms 462.55ms   82.64%
    Req/Sec     0.92k    91.40     1.07k    82.16%
  73237 requests in 20.07s, 59.02MB read
Requests/sec:   3649.30
Transfer/sec:      2.94MB

## windows-bun.ts:
wrk -t4 -c100 -d20s http://192.168.5.187:8001/api/teacher/transform
Running 20s test @ http://192.168.5.187:8001/api/teacher/transform
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.07ms    5.35ms 238.22ms   92.76%
    Req/Sec     1.95k   289.50     2.36k    75.38%
  155071 requests in 20.04s, 73.06MB read
Requests/sec:   7738.86
Transfer/sec:      3.65MB

wrk -t4 -c150 -d20s http://192.168.5.187:8001/api/teacher/transform
Running 20s test @ http://192.168.5.187:8001/api/teacher/transform
  4 threads and 150 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    21.73ms    5.73ms 117.27ms   80.41%
    Req/Sec     1.72k   213.12     2.18k    82.12%
  136897 requests in 20.04s, 64.49MB read
Requests/sec:   6831.56
Transfer/sec:      3.22MB

## conclusion
The wrk connection numbers are set to 100 and 150. From the above comparison, we can see that bun.ts's QPS is almost twice that of Go, and the average latency is lower than Go. 
During the run, Go consumes CPU at idle 0%, 40% under load, memory at idle 8MB, 40MB under load; bun.ts consumes CPU at idle 0%, 15% average under load, memory at idle 220MB, 280MB average under load. That is, bun consumes more memory than Go, but less CPU than Go.

PS1: Since they are on the same LAN, network overhead can be ignored.
PS2: Both services' logs are written to files but not stdout under normal circumstances. The logs have been optimized and tested to have minimal impact on performance.

Test both services running on the Linux machine, execute wrk from Windows WSL, run for 30s:
## linux-go:
wrk -t4 -c100 -d30s http://192.168.5.104:8000/api/teacher/list
Running 30s test @ http://192.168.5.104:8000/api/teacher/list
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   158.81ms   87.18ms 735.88ms   74.04%
    Req/Sec   163.04     69.41   400.00     64.34%
  19378 requests in 30.07s, 15.62MB read
Requests/sec:    644.33
Transfer/sec:    531.69KB

wrk -t4 -c100 -d30s http://192.168.5.104:8000/api/teacher/list
Running 30s test @ http://192.168.5.104:8000/api/teacher/list
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   164.51ms  100.14ms 850.43ms   76.87%
    Req/Sec   162.99     68.33   373.00     65.51%
  19328 requests in 30.50s, 15.58MB read
Requests/sec:    633.70
Transfer/sec:    522.92KB

## linux-bun.ts:
wrk -t4 -c100 -d30s http://192.168.5.104:8001/api/teacher/transform
Running 30s test @ http://192.168.5.104:8001/api/teacher/transform
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    45.58ms   46.45ms 588.87ms   97.16%
    Req/Sec   637.01    123.65     0.89k    74.92%
  76057 requests in 30.56s, 35.83MB read
Requests/sec:   2488.82
Transfer/sec:      1.17MB

wrk -t4 -c100 -d30s http://192.168.5.104:8001/api/teacher/transform
Running 30s test @ http://192.168.5.104:8001/api/teacher/transform
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    47.72ms   53.06ms 638.35ms   96.54%
    Req/Sec   628.32    110.80     0.94k    67.42%
  75203 requests in 30.68s, 35.43MB read
Requests/sec:   2451.28
Transfer/sec:      1.15MB

## conclusion
Since pgsql is also on Linux consuming some resources, Go's QPS is very small, only a few hundred. If separated, it would be several thousand. This doesn't affect the conclusion - the conclusion that bun.ts is much faster than Go basically remains unchanged, and since Go's model here is more prone to competing for resources with pgsql on the same machine, it's even slower.
During the run, Go consumes CPU at idle 0.4%, 55% under load, memory at idle 24MB, 40MB under load; bun.ts consumes CPU at idle 0.5%, 27% average under load, memory at idle 80MB, 130MB average under load. Still, bun consumes more memory than Go, but less CPU than Go.

# Total Conclusion:
Often it's said that scripting languages are slower than static languages, but that's obviously not necessarily true. For most IO-intensive applications, TS is very suitable and development is faster with scripting languages. Additionally, the bun runtime and ElysiaJS are relatively high-performance compared to other frameworks. I've tested other web frameworks in JS before, see in other-jsbench.md.
Of course, this is just a test with simple examples. For complex applications, the gap between the two might be smaller.
On multi-core machines, since Node or bun's underlying network implementation is multi-threaded, it can be effectively utilized. Therefore, on multi-core machines, if it's still IO-intensive, there's no need to start multiple services. However, if there are compute-intensive tasks in the TS code, you can use pm2 or directly use nginx's upstream to manage multiple bunjs services.