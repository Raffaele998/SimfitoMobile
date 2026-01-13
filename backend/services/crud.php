<?php
// CRUD postgres 8/8/2011
// 9/8/2011   aggiunti commenti alle funzioni
// 9/8/2011   aggiunte funzioni DeleteWhere,UpdateWhere
// 24/8/2011  aqggiunta funzione ReadOptionSql
// 10/9/2011  correzione piccolo bug
// 12/9/2011  aggiunta ReadTablePaged
// 27/9/2011  aggiunte in ReadTable supporto per un numero potenzialmente arbitrario di flags
// 29/9/2011  in ReadValue e ReadValueWhere aggiunto il supporto opzionale per campi composti con clausola 'AS nome'
// 24/10/2011 aggiunta ReadValueSQL($sql) per leggere un singolo valore tramite una query SQL
class CRUD
{
	private $connessione;
	private $connection;
	public $result;
	public $PagingOnTh;
	function __construct($cc)
	{
		$this->connection = $cc;
		$this->PagingOnTh=true;
	}

	public function connect() // effettua la connessione al DB
	{
		try{
			$this->connessione = pg_connect($this->connection);
			if (!$this->connessione) {
				error_log("DB CONNECTION ERROR: " . pg_last_error());
				return false;
			}
		} catch (Exception $e) {
			error_log("DB CONNECTION EXCEPTION: " . $e->getMessage());
			return false;
		}
		return true;
	}

	public function connection_close()		//chiude la connessione al DB
	{
		pg_close($this->connessione);
	}
	public function Read($sql)			// esegue una query e conserva il riferimento al risultato
	{
		$this->result = pg_query($this->connessione,$sql);
		if (!$this->result) {
			error_log("QUERY ERROR: " . pg_last_error($this->connessione) . " | SQL: " . $sql);
		}
	}

	public function fetch_assoc()		// ritorna un record dal risultato della chiamata a Read
	{
		if (!$this->result) {
			return false;
		}
		return pg_fetch_assoc($this->result);
	}

	public function FetchRow($sql)		// esegue una query e ritorna la prima riga del risultato
	{
		$res = pg_query($this->connessione,$sql);
		return pg_fetch_assoc($res);
	}

	public function RecNo() {
		return pg_num_rows($this->result);
	}

	public function ReadColumn($sql,$col)	// esegue una query e ritorna TUTTA una colonna
	{
		$res = pg_query($this->connessione,$sql);
		$rr = array();
		$i=0;
		while ($row = pg_fetch_assoc($res))
			$rr[$i++] = $row[$col];
		return $rr;
	}

	public function ReadColumnId($sql,$col)	// esegue una qery e ritorna una colonna indicizzata sul campo 'id'
	{
		$res = pg_query($this->connessione,$sql);
		$rr = array();
		while ($row = pg_fetch_assoc($res))
			$rr[$row['id']] = $row[$col];
		return $rr;
	}

	public function ReadTableAsXML($sql) // esegue una query ed emette il risultato come xml (<data><datum><campo 1>nome valore campo 1<campo 1>...</datum>...<datum>...</datum></data>)
	{
		header ("Content-Type:text/xml");
		$result=pg_query($this->connessione,$sql);
		if(!$result)
			throw new Exception("Errore nella query: ".$sql);
		$xmlstr=<<<XML
<?xml version='1.0' standalone='yes'?>
<data></data>
XML;
		$xml = new SimpleXMLElement($xmlstr);
		while($data=pg_fetch_assoc($result)){
			$datum = $xml->addChild('datum');
			foreach($data as $field=>$value){
				$datum->addChild($field,htmlentities($value));
			}
		}
		echo $xml->asXML();
	}
	public function ReadFieldAsXml($sql) // esegue una query ed emette nome e tipo dei campi ECCETTO QUELLI DI TIPO "geometry";
	{
		header ("Content-Type:text/xml");
		$result=pg_query($this->connessione,$sql);
		if(!$result)
			throw new Exception("Errore nella query: ".$sql);
		$xmlstr=<<<XML
<?xml version='1.0' standalone='yes'?>
<data></data>
XML;
		$xml = new SimpleXMLElement($xmlstr);
		for ($i=0;$i<pg_num_fields($result);$i++){
			if(pg_field_type($result,$i)!="geometry"){
				$datum = $xml->addChild('datum');
				$datum->addChild('campo',pg_field_name($result,$i));
				$datum->addChild('tipo',pg_field_type($result,$i));
			}
		}
		echo $xml->asXML();
	}

	/*public function ReadTableAsJson($sql,$extra='') // esegue una query ed emette il risultato come xml (<data><datum><campo 1>nome valore campo 1<campo 1>...</datum>...<datum>...</datum></data>)
	{
		$result=pg_query($this->connessione,$sql);
		if(!$result)
			throw new Exception("Errore nella query: ".$sql);
		$json="\"data\":[";
		$i=0;
		while($data=pg_fetch_assoc($result)){
			if ($i>0) $json.=",";
			$json.="{";
			$j=0;
			foreach($data as $field=>$value){
				if($j>0) $json.=",";
				$value=str_replace('"',"'",$value);
				$json.="\"$field\":\"$value\"";
				$j++;
			};
			$json.="}";
			$i++;
		}
		$totale="{\"results\":\"$i\",";
		if($extra!='')
			$json.="],$extra}";
		else
			$json.="]}";
		return $totale.$json;
	}*/

	public function ReadTableAsJson($sql,$extra='') // esegue una query ed emette il risultato come xml (<data><datum><campo 1>nome valore campo 1<campo 1>...</datum>...<datum>...</datum></data>)
	{
		$result=pg_query($this->connessione,$sql);
		if(!$result)
			throw new Exception("Errore nella query: ".$sql);
		//$json="\"data\":[";
		$i=0;
		$datum= Array();
		$datum['data']= Array();
		while($data=pg_fetch_assoc($result)){
			$datum['data'][]=$data;
			/*if ($i>0) $json.=",";
			$json.="{";
			$j=0;
			foreach($data as $field=>$value){
				if($j>0) $json.=",";
				$value=str_replace('"',"'",$value);
				$json.="\"$field\":\"$value\"";
				$j++;
			};
			$json.="}";*/
			$i++;
		}

		/*$totale="{\"results\":\"$i\",";*/
		if($extra!=''){
			//$json.="],$extra}";
			$xtr= explode(":",$extra);
			$datum[$xtr[0]]= $xtr[1];
		}
		/*else
			$json.="]}";
		return $totale.$json;*/
		$datum['results']=$i;
		$datum['success']=true;
//		$datum['sql']=$sql;
		return json_encode($datum);
	}

	public function ReadTableAsJson2($sql,$extra='') // esegue una query ed emette il risultato come xml (<data><datum><campo 1>nome valore campo 1<campo 1>...</datum>...<datum>...</datum></data>)
	{
		$result=pg_query($this->connessione,$sql);
		if(!$result)
			throw new Exception("Errore nella query: ".$sql);
		//$json="\"data\":[";
		$i=0;
		$datum= Array();
		$datum['data']= Array();
		while($data=pg_fetch_assoc($result)){
			$datum['data'][]=$data;
			/*if ($i>0) $json.=",";
			$json.="{";
			$j=0;
			foreach($data as $field=>$value){
				if($j>0) $json.=",";
				$value=str_replace('"',"'",$value);
				$json.="\"$field\":\"$value\"";
				$j++;
			};
			$json.="}";*/
			$i++;
		}
		$datum['results']=$i;
		$datum['success']=true;
//		$datum['sql']=$sql;
		return json_encode($datum);
		/*$totale="{\"results\":\"$i\",";
		if($extra!='')
			$json.="],$extra}";
		else
			$json.="]}";
		return $totale.$json;*/
	}

	public function ReadTable($sql,$title,$heads,$fields,$flags)	 // esegue una query ed emette il risultato in forma tabellare
	{
		$idname = 'id';
		$n = count($heads);
		$nx = 0;
		foreach($flags as $name=>$value) {
			switch($name) {		// supported items
			case 'del':
			case 'det':
			case 'ed':
			case 'view':
			case 'export':
				if ($value!='')
					$nx++;
			break;
			}
		}
		$n += $nx;
		echo "<table border=1><tr><th colspan=$n>$title</th></tr>";
		echo "<tr>";
		for($i=0;$i<count($heads);$i++)
			echo "<th>$heads[$i]</th>";
		for($i=0; $i<$nx;$i++)
			echo '<th>&nbsp;</th>';
		echo '</tr>';
		$result = pg_query($this->connessione,$sql);
		$j=0;
		while($dati=pg_fetch_assoc($result)){
			echo "<tr>";
			for($i=0;$i<count($heads);$i++) {
				$d = $dati[$fields[$i]];
				echo "<td>$d&nbsp;</td>";
			}
			foreach($flags as $name=>$value) {
				if ($name=='det' && $value!='') {
					$det = $flags['det'];
					echo "<td><a href=\"$det&id=$dati[$idname]\">Detail</a></td>";
				}
				if ($name=='ed' && $value!='') {
					$ed = $flags['ed'];
					echo "<td><a href=\"$ed&id=$dati[$idname]\">Edit</a></td>";
				}
				if($name=='del' && $value!='') {
					$del = $flags['del'];
					echo "<td><a href=\"$del&id=$dati[$idname]\">Delete</a></td>";
//					echo "<td><a href=\"$del&id=$dati[$idname]\" onclick=\"return confirm_delete();\">Delete</a></td>";
				}
				if ($name=='view' && $value!='') {
					$view = $flags['view'];
					echo "<td><a target=\"_blank\" href=\"$view&id=$dati[$idname]\">View</a></td>";
				}
				if ($name=='export' && $value!='') {
					$export = $flags['export'];
					echo "<td><a href=\"$export&id=$dati[$idname]\">Export</a></td>";
				}
			}
			echo "</tr>";
			$j++;
		}
		echo "<tr><td colspan=$n>";
		echo "Record Totali : $j";
		echo "</td></tr>";
		echo "</table>";
	}

	public function ReadTablePaged($sql,$title,$heads,$fields,$flags,$start,$count,$link)	 // esegue una query ed emette il risultato in forma tabellare
	{
		$idname = 'id';
		$n = count($heads);
		$nx = 0;
		foreach($flags as $name=>$value) {
			switch($name) {		// supported items
			case 'del':
			case 'det':
			case 'ed':
			case 'view':
			case 'export':
				if ($value!='')
					$nx++;
			break;
			}
		}
		$n += $nx;

		echo "<table border=1><tr><th colspan=$n>$title</th></tr>";
		echo "<tr>";
		for($i=0;$i<count($heads);$i++)
			echo "<th>$heads[$i]</th>";
		for($i=0; $i<$nx;$i++)
			echo '<th>&nbsp;</th>';
		echo '</tr>';
		$result = pg_query($this->connessione,$sql);
		$j=0;
		while($dati=pg_fetch_assoc($result)){
			if ($j>=$start && $j<($start+$count)) {
				echo "<tr>";
				for($i=0;$i<count($heads);$i++) {
					$d = $dati[$fields[$i]];
					echo "<td>$d&nbsp;</td>";
				}
				foreach($flags as $name=>$value) {
					if ($name=='det' && $value!='') {
						$det = $flags['det'];
						echo "<td><a href=\"$det&id=$dati[$idname]\">Detail</a></td>";
					}
					if ($name=='ed' && $value!='') {
						$ed = $flags['ed'];
						echo "<td><a href=\"$ed&id=$dati[$idname]\">Edit</a></td>";
					}
					if($name=='del' && $value!='') {
						$del = $flags['del'];
						echo "<td><a href=\"$del&id=$dati[$idname]\">Delete</a></td>";
//						echo "<td><a href=\"$del&id=$dati[$idname]\" onclick=\"return confirm_delete();\">Delete</a></td>";
					}
					if ($name=='view' && $value!='') {
						$view = $flags['view'];
						echo "<td><a target=\"_blank\" href=\"$view&id=$dati[$idname]\">View</a></td>";
					}
					if ($name=='export' && $value!='') {
						$export = $flags['export'];
						echo "<td><a href=\"$export&id=$dati[$idname]\">Export</a></td>";
					}
				}
				echo "</tr>";
			}
			$j++;

		}
		echo "<tr><td colspan=$n>";
		echo "Record Totali : $j";
		echo "</td></tr>";

		$startf = 0;
		$startp = ( $start-$count<0 ? 0: $start-$count );
		$startn = ( $start+$count>=$j ? $start : $start+$count );
		$startl = ((int)($j/$count))*$count;

		$first = "&start=$startf&count$count";
		$prev  = "&start=$startp&count=$count";
		$next  = "&start=$startn&count=$count";
		$last  = "&start=$startl&count$count";
		if ($this->PagingOnTh)
			echo "<tr><th colspan=$n>";
		else
			echo "<tr><td colspan=$n>";

		echo "<A href=\"$link$first\">First</A> ";
		echo "<A href=\"$link$prev\">Prev</A> ";
		echo "<A href=\"$link$next\">Next</A> ";
		echo "<A href=\"$link$last\">Last</A>";
		if ($this->PagingOnTh)
			echo "</th></tr>";
		else
			echo "</td></tr>";
		echo "</table>";
	}

	function ReadOption($table,$id,$nome,$extra)	// legge una tabella e la emette come option per una select
	{
		foreach ($extra as $xid => $xnome)
			echo "<option value\"$xid\">$xnome</option>";
		$sql = "SELECT $nome,$id FROM $table ORDER BY $nome;";
		$result = pg_query($this->connessione,$sql);
		while($dati=pg_fetch_assoc($result)){
			$xid = $dati[$id];
			$xnome = $dati[$nome];
			echo "<option value=\"$xid\">$xnome</option>";
		}
	}

	function ReadOptionSql($sql,$id,$nome,$extra)	// legge una query e 2 campi li emette come option per una select
	{
		foreach ($extra as $xid => $xnome)
			echo "<option value\"$xid\">$xnome</option>";
		$result = pg_query($this->connessione,$sql);
		while($dati=pg_fetch_assoc($result)){
			$xid = $dati[$id];
			$xnome = $dati[$nome];
			echo "<option value=\"$xid\">$xnome</option>";
		}
	}

	function ReadValue($table,$id,$col,$as='')		// legge un valore da una tabella tramite il campo 'id'
	{
		if ($as!='') {
			$coldef = "$col AS $as";
		}
		else {
			$coldef = $col;
			$as = $col;
		}
		$sql = "SELECT $coldef FROM $table WHERE id=$id;";
		$res = pg_query($this->connessione,$sql);
		$row = pg_fetch_assoc($res);
		return $row[$as];
	}

	function ReadValueSQL($sql)		// legge un singolo valore tramite una query SQL
	{
		$res = pg_query($this->connessione,$sql);
		$row = pg_fetch_row($res);
		return $row[0];
	}

	function ReadValueWhere($table,$where,$col,$as='')  // legge un valore da una tabella tramite clausola where
	{
		if ($as!='') {
			$coldef = "$col AS $as";
		}
		else {
			$coldef = $col;
			$as = $col;
		}
		$sql = "SELECT $coldef FROM $table WHERE $where;";
		$res = pg_query($this->connessione,$sql);
		$row = pg_fetch_assoc($res);
		return $row[$as];
	}

	function SQL($sql)				// esecuzione diretta di una query, non ritorna nulla
	{
		try {
			$result=pg_query($this->connessione,$sql);
			if(!$result)
				return false;
		} catch (Exception $e) {
			return false;
		}
		return true;
	}

	function SQLReturn($sql)				// esecuzione diretta di una query, non ritorna nulla
	{
		try {
			$result=pg_query($this->connessione,$sql);
			if(!$result)
				return false;
		} catch (Exception $e) {
			return false;
		}
		$returning=pg_fetch_array($result);
		return $returning[0];
	}

	function Create($table,$fields)		// aggiunge un record ad una tabella, ritorna l' 'id'
	{
		$fnames='';
		$fvalues='';
		foreach($fields as $f=>$v) {
			$fnames .= "$f,";
			$fvalues .= "'$v',";
		}
		$fnames = substr($fnames, 0, -1);	// remove last ,
		$fvalues = substr($fvalues, 0, -1);
		$sql = "INSERT INTO $table($fnames) VALUES($fvalues) RETURNING id;";
		$res = pg_query($this->connessione,$sql);
		$row = pg_fetch_assoc($res);
		return $row['id'];
	}
	function Update($table,$idv,$fields)		// modifica un record di una tabella tramite l' 'id'
	{
		$replace='';
		foreach($fields as $f=>$v)
			$replace .= "$f='$v',";
		$replace = substr($replace, 0, -1);	// remove last ,
		$sql = "UPDATE $table SET $replace WHERE id=$idv;";
		pg_query($this->connessione,$sql);

	}
	function Delete($table,$id)				// elimina un record da una tabella tramite l' 'id'
	{
		$sql = "DELETE FROM $table where id=$id;";
		pg_query($this->connessione,$sql);
	}
	function UpdateWhere($table,$where,$fields)		// modifica uno o piu' record di una tabella tramite clausola where
	{
		$replace='';
		foreach($fields as $f=>$v)
			$replace .= "$f='$v',";
		$replace = substr($replace, 0, -1);	// remove last ,
		$sql = "UPDATE $table SET $replace WHERE $where;";
		pg_query($this->connessione,$sql);

	}
	function DeleteWhere($table,$where)				// elimina uno o piu' record da una tabella tramite clausola where
	{
		$sql = "DELETE FROM $table where $where;";
		pg_query($this->connessione,$sql);
	}
	function ReadAll($sql) 							// legge i risultati di una quety in una botta sola!
	{
			$result=pg_query($this->connessione,$sql);
			$data = [];
			while($rx = pg_fetch_assoc($result)) {
				$data[] = $rx;
			}
			return $data;
	}
};
?>
