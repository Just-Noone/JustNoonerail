<?php
class DatabaseConnection {
    private $db;

    public function __construct() {
        $this->connect();
    }

    private function connect() {
        define('DBSERVER', 'localhost'); // Database server 
        define('DBUSERNAME', 'root'); // Database username 
        define('DBPASSWORD', 'Dominik#123456789'); // Database password 
        define('DBNAME', 'jnr'); // Database name

        try {
            $this->db = new PDO("mysql:host=".DBSERVER.";dbname=".DBNAME, DBUSERNAME, DBPASSWORD);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            throw new Exception("Error: " . $e->getMessage());
        }
    }
}

$database = new DatabaseConnection();
?>