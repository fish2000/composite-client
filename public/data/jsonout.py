import json
from pprint import pprint
userFile = open('users.json', 'r')
videolist = open('videolist.txt', 'r')
jdata = json.load(userFile)

index = 0
for item in jdata['result']:
	if index%31 == 0:
		videolist.seek(0,0)
	video_url = videolist.readline().strip()
	item['video'] = video_url
	index = index + 1


with open('new_users2.json', 'w') as outfile:
  json.dump(jdata, outfile, sort_keys=False, indent=4)

