import json,sys,glob
for f in sorted(glob.glob(".lighthouse/*.json")):
  d=json.load(open(f)); c=d['categories']; a=d['audits']
  print(f.split('/')[-1].ljust(20), ' '.join(f"{k[:4]}={round(v['score']*100)}" for k,v in c.items()),
    '| LCP', a['largest-contentful-paint']['displayValue'], 'CLS', a['cumulative-layout-shift']['displayValue'], 'TBT', a['total-blocking-time']['displayValue'])
