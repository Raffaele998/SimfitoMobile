--layer trappole

SELECT count(*),osservazioni.trappole_geometry_id, trappole_geometry.codice, statotrappole_id, sum(catture) as catture, organismo, tecnico_id, anno, nome, scheda_id, trappole_geometry.the_geom
FROM simfito.osservazioni
LEFT JOIN simfito.trappole_geometry ON osservazioni.trappole_geometry_id=trappole_geometry.id
WHERE organismo='DACUDO' AND (datacreazione BETWEEN '2021-01-01' AND '2021-12-31')
GROUP BY trappole_geometry_id, trappole_geometry.the_geom, trappole_geometry.codice, statotrappole_id, organismo, tecnico_id, anno, nome, scheda_id
order by 3 desc, 1 desc