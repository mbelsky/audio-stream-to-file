# audio-stream-to-file

Node.js app to pipe an audio stream to a file

## Setup

1. Create a new sudo user
1. Switch user
1. Clone sources
1. `cd audio-stream-to-file && make build`
1. Create output folder
1. Add crontask

### How to add cron task

```sh
# 1. open crontab file
crontab -e

# 2. add task
X X * * X docker run mbelsky/stream-to-file:latest -d --restart on-failure:5 --env DEST_DIR=/dest-dir --env STREAM_URL=??? --mount type=bind,src=???,dst=/dest-dir

# 3. Replace `???` in the task with valid values
```
