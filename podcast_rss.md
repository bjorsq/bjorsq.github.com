---
layout: none
permalink: podcast/rss.xml
---

<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>bjorsq.net podcast</title>
		<description>highlights from my MP3 player</description>		
		<link>http://www.bjorsq.net/podcast/</link>
		<atom:link href="http://www.bjorsq.net/podcast/rss.xml" rel="self" type="application/rss+xml" />
		{% if site.data.podcast %}
			{% for episode in site.data.podcast %}
			<item>				
				<title>{{ episode.title | xml_escape }}</title>
				<description>{{ episode.description | xml_escape }}</description>
				<pubDate>{{ episode.date | date: "%a, %d %b %Y %H:%M:%S %z" }}</pubDate>
				<link>http://docs.google.com/uc?export=open&amp;id={{ episode.google_mp3_id }}</link>
				<guid isPermaLink="true">http://docs.google.com/uc?export=open&amp;id={{ episode.google_mp3_id }}</guid>
			</item>
			{% endfor %}
		{% endif %}	
	</channel>
</rss>