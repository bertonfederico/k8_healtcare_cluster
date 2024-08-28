-- Basic queries
SHOW CREATE TABLE ..table_name..;
ALTER TABLE ..table_name.. ADD COLUMN ..column_name.. ..column_type..;

-- Creating "clusterdb" database
CREATE DATABASE clusterdb;
USE clusterdb;

-- Creating "users" table
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1

-- Creating "eeg_data_table" table
CREATE TABLE `eeg_data_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user` int(11) DEFAULT NULL,
  `eeg_data` json NOT NULL,
  `epilepsy_prediction_probability` decimal(9,8) NOT NULL,
  `register_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `insert_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_user` (`fk_user`),
  CONSTRAINT `eeg_data_table_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1

-- Creating "heartbeat_data_table" table
CREATE TABLE `heartbeat_data_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user` int(11) DEFAULT NULL,
  `heartbeat_value` int(11) NOT NULL,
  `register_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `insert_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_unique_user_timestamp` (`fk_user`,`register_timestamp`),
  KEY `fk_user` (`fk_user`),
  CONSTRAINT `heartbeat_data_table_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1267 DEFAULT CHARSET=latin1

