# mo-re

> **mo**nitor & **re**port (eventually)

## monitoring

To run:

Edit the config.js file to suit the site you want to periodically ping and any other setting that makes sense for you.

Then run the monitoring script, preferrably in a machine that never goes to sleep, so that you get no gaps in your data:

```bash
node monitor.js
```

You can interrupt the execution (with CTRL+C). You can always pick up monitoring by executing the above command again.

The monitoring script appends data to the existing report file.

If it's the first time it runs, it will also write some CSV headers so it's easier to visualise.

## reporting

Not done, try loading the CSV in any software that knows how to deal with CSV files ;-)
