 for i in $( ls ); do echo -n 'update simfito.scheda set numattach=' ;echo -n `ls $i |wc -l` ; echo -n ' where idscheda=' $i ; echo ';' ; done >/tmp/cippa.sql
