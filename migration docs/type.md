Objective:
This document outlines the steps to safely change the data type of any column in a PostgreSQL table, particularly from serial or other types to integer, without causing data loss or truncation.

Migration Steps
Step 1: Remove Default Constraints
Before modifying the column type, you must first remove any default values that rely on sequences (for serial columns) or other constraints.

sql

ALTER TABLE <table_name>
    ALTER COLUMN <column_name> DROP DEFAULT;
Replace <table_name> with the name of the table (e.g., roles_module).
Replace <column_name> with the name of the column you wish to modify.
This step ensures that no dependencies on sequences or other default values remain, preventing conflicts during the migration.

Step 2: Drop the Sequences (if applicable)
If the column being modified is a serial column, drop the associated sequence to remove its dependency.

sql

DROP SEQUENCE IF EXISTS <table_name>_<column_name>_seq;
Replace <table_name> with the table name.
Replace <column_name> with the column name.
This ensures that PostgreSQL no longer depends on the sequence for generating auto-incrementing values.

Step 3: Alter the Column Type
Once the default and sequence are removed, safely change the column's data type. Use the USING clause to explicitly cast existing data to the new type.

sql

ALTER TABLE <table_name>
    ALTER COLUMN <column_name> SET DATA TYPE <new_type> USING <column_name>::<new_type>;
Replace <table_name> with the table name.
Replace <column_name> with the column name.
Replace <new_type> with the desired type (e.g., INTEGER).
For example, to change from serial to integer:

sql

ALTER TABLE roles_module
    ALTER COLUMN created_by SET DATA TYPE INTEGER USING created_by::INTEGER;
This step ensures safe type casting, preventing potential data corruption.

Step 4: (Optional) Recreate the Sequences
If the column requires auto-incrementing values (e.g., created_by, updated_by), recreate the sequence and set it as the default for the column.

sql

CREATE SEQUENCE <table_name>_<column_name>_seq START 1;
ALTER TABLE <table_name>
    ALTER COLUMN <column_name> SET DEFAULT nextval('<table_name>_<column_name>_seq');
Replace <table_name> and <column_name> as before.
This step re-establishes the auto-incrementing behavior using the newly created sequence.