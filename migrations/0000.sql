START TRANSACTION;

CREATE TABLE coffee_shop.menu (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(30) NOT NULL,
    category ENUM('coffee', 'tea', 'sandwich') NOT NULL,
    PRIMARY KEY(id),
    INDEX(name)
);

INSERT INTO coffee_shop.menu (name, category)
    VALUES 
        ('americano', 'coffee'),
        ('espresso', 'coffee'),
        ('flat_white', 'coffee'),
        ('cappuccino', 'coffee'),
        ('latte', 'coffee');

CREATE TABLE coffee_shop.orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    client_email varchar(255) NOT NULL,
    item_id INT UNSIGNED NOT NULL,
    quantity SMALLINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('created', 'cancelled', 'processing', 'done') DEFAULT 'created',
    PRIMARY KEY(id),
    INDEX(client_email),
    CONSTRAINT orders_fk_menu
        FOREIGN KEY (item_id)
        REFERENCES menu(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
); 

COMMIT;