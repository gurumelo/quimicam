#!/bin/bash
host="http://localhost:3434/a/f"
contrasena="TUCONTRASEÑA"
gphoto2 --auto-detect
gphoto2 --set-config capture=1
while true; do
	e=$( gphoto2 --filename q.jpg --force-overwrite --capture-image-and-download )
	if echo "$e" | grep -q "debug"; then
		echo "error";
	else
		q=$( base64 -w 0 q.jpg )
		echo "bien"
		#curl --silent --insecure -H "Content-Type: application/json" -X POST -d '{"c":"'$contrasena'","fo":"'$q'"}' http://localhost:3434/a/f
		curl --insecure -X POST -H "Content-Type: application/json" -d @- "$host" <<CURL_DATA
		{ "c": "$contrasena", "fo": "$q" }
CURL_DATA

	fi
	sleep 30
done
