/***********************************installation of db******************************************/

var db = Titanium.Database.install('/GongchaPOS_DB.sqlite', 'GongchaPOS_DB');

/***********************Method for save data into DB for All Items*************************************/

exports.saveAndUpdate_AllData = function(resultData) {

	try {

		db = Ti.Database.open('GongchaPOS_DB');
		//	Ti.API.info('GongchaPOS_DB db open');
		//	Ti.API.info(JSON.stringify(resultData));
		if (resultData.hasOwnProperty("category")) {
			//	Ti.API.info('*category* '+JSON.stringify(resultData.category));
			for (var i = 0; i < resultData.category.length; i++) {

				var selectedData = db.execute('SELECT id FROM ospos_cat where id=' + resultData.category[i].id);

				var cat_id = parseInt(resultData.category[i].id);
				var category_name = resultData.category[i].category_name;
				var category_description = resultData.category[i].category_description;
				var category_image = resultData.category[i].category_image;
				var category_sort = parseInt(resultData.category[i].category_sort);
				var status = resultData.category[i].status;
				var is_deleted = resultData.category[i].is_deleted;
				var created_at = resultData.category[i].created_at;
				var updated_at = resultData.category[i].updated_at;

				if (selectedData.getRowCount() == 0) {
					db.execute('INSERT INTO ospos_cat(id,category_name,category_description,category_image, category_sort, status, is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)', cat_id, category_name, category_description, category_image, category_sort, status, is_deleted, created_at, updated_at);

				} else {
					db.execute('UPDATE ospos_cat SET category_name=?,category_description=?,category_image=?,category_sort=?,status=?, is_deleted=?,created_at=?,updated_at=?  WHERE id=' + cat_id, category_name, category_description, category_image, category_sort, status, is_deleted, created_at, updated_at);

				}
			}
		}
		if (resultData.hasOwnProperty("menus")) {
			Ti.API.info('*menus* ' + JSON.stringify(resultData.menus));
			for (var i = 0; i < resultData.menus.length; i++) {

				var menuData = db.execute('SELECT id FROM ospos_menus where id=' + resultData.menus[i].id);

				var menu_id = parseInt(resultData.menus[i].id);
				var sku_code = resultData.menus[i].sku_code;
				var menu_name = resultData.menus[i].menu_name;
				var menu_description = resultData.menus[i].menu_description;
				var menu_image = resultData.menus[i].menu_image;
				var menu_alias = resultData.menus[i].menu_alias;
				var category_id = resultData.menus[i].category_id;
				var category_name = resultData.menus[i].category_name;
				var store_id = resultData.menus[i].store_id;
				var created_by_id = resultData.menus[i].created_by_id;
				var menu_sort = resultData.menus[i].menu_sort;
				var is_deleted = resultData.menus[i].is_deleted;
				var status = resultData.menus[i].status;
				var created_at = resultData.menus[i].created_at;
				var updated_at = resultData.menus[i].updated_at;
				db.execute('DELETE FROM ospos_menu_modifier_group WHERE menu_id= ' + menu_id);
				db.execute('DELETE FROM ospos_menu_modifier_serving WHERE menu_id= ' + menu_id);
				db.execute('DELETE FROM ospos_menu_prefix WHERE menu_id= ' + menu_id);
				db.execute('DELETE FROM ospos_menu_serving WHERE menu_id= ' + menu_id);

				if (menuData.getRowCount() == 0) {
					db.execute('INSERT INTO ospos_menus(id,sku_code,menu_name,menu_description,menu_image,category_id,store_id,created_by_id,menu_sort,is_deleted,status,created_at,updated_at,menu_alias,category_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', menu_id, sku_code, menu_name, menu_description, menu_image, category_id, store_id, created_by_id, menu_sort, is_deleted, status, created_at, updated_at, menu_alias, category_name);
				} else {
					//db.execute('UPDATE ospos_menus SET sku_code=?,menu_name=?,menu_description=?,menu_image=?,category_id=?,store_id=?,created_by_id=?,menu_sort=?,is_deleted=?,status=?,created_at=?,updated_at=? WHERE id=' + menu_id, sku_code, menu_name, menu_description, menu_image, category_id, store_id, created_by_id, menu_sort, is_deleted, status, created_at, updated_at);
					db.execute('UPDATE ospos_menus SET sku_code=?,menu_name=?,menu_description=?,menu_image=?,category_id=?,store_id=?,created_by_id=?,menu_sort=?,is_deleted=?,status=?,created_at=?,updated_at=?,menu_alias=?,category_name=?  WHERE id=' + menu_id, sku_code, menu_name, menu_description, menu_image, category_id, store_id, created_by_id, menu_sort, is_deleted, status, created_at, updated_at, menu_alias, category_name);

				}
			}
		}
		if (resultData.hasOwnProperty("menu_serving_price")) {
			//	Ti.API.info('*menu_serving_price* '+JSON.stringify(resultData.menu_serving_price));
			for (var i = 0; i < resultData.menu_serving_price.length; i++) {

				var menu_serving_price_Data = db.execute('SELECT id FROM ospos_menu_serving where id=' + resultData.menu_serving_price[i].id);

				var menu_serving_id = parseInt(resultData.menu_serving_price[i].id);
				var menu_id = resultData.menu_serving_price[i].menu_id;
				var serving_id = resultData.menu_serving_price[i].serving_id;
				var price = resultData.menu_serving_price[i].price;
				var status = resultData.menu_serving_price[i].status;
				var is_deleted = resultData.menu_serving_price[i].is_deleted;
				var created_at = resultData.menu_serving_price[i].created_at;
				var updated_at = resultData.menu_serving_price[i].updated_at;

				// if (menu_serving_price_Data.getRowCount() == 0) {
				db.execute('INSERT INTO ospos_menu_serving(id,menu_id,serving_id,price,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)', menu_serving_id, menu_id, serving_id, price, status, is_deleted, created_at, updated_at);
				// } else {

				//db.execute('INSERT INTO ospos_menu_serving(id,menu_id,serving_id,price,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)', menu_serving_id, menu_id, serving_id, price, status, is_deleted, created_at, updated_at);

				//db.execute('UPDATE ospos_menu_serving SET menu_id=?,serving_id=?,price=?,status=?,is_deleted=?,created_at=?,updated_at=?  WHERE id=' + menu_serving_id, menu_id, serving_id, price, status, is_deleted, created_at, updated_at);
				// }
			}

		}
		if (resultData.hasOwnProperty("menu_modifier_group")) {
			//Ti.API.info('*menu_modifier_group* ' + JSON.stringify(resultData.menu_modifier_group));
			for (var i = 0; i < resultData.menu_modifier_group.length; i++) {

				var menu_modifier_group_Data = db.execute('SELECT id FROM ospos_menu_modifier_group where id=' + resultData.menu_modifier_group[i].id);

				var menu_group_id = parseInt(resultData.menu_modifier_group[i].id);
				var menu_id = resultData.menu_modifier_group[i].menu_id;
				var modifier_group_id = resultData.menu_modifier_group[i].modifier_group_id;
				var is_required = resultData.menu_modifier_group[i].is_required;
				var status = resultData.menu_modifier_group[i].status;
				var is_deleted = resultData.menu_modifier_group[i].is_deleted;
				var created_at = resultData.menu_modifier_group[i].created_at;
				var updated_at = resultData.menu_modifier_group[i].updated_at;

				// if (menu_modifier_group_Data.getRowCount() == 0) {

				db.execute('INSERT INTO ospos_menu_modifier_group(id,menu_id,modifier_group_id,is_required,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)', menu_group_id, menu_id, modifier_group_id, is_required, status, is_deleted, created_at, updated_at);
				//} else {

				//if (resultData.menu_modifier_group[i].is_deleted == "0") {

				//db.execute('INSERT INTO ospos_menu_modifier_group(id,menu_id,modifier_group_id,is_required,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)', menu_group_id, menu_id, modifier_group_id, is_required, status, is_deleted, created_at, updated_at);
				//} else {
				//db.execute('UPDATE ospos_menu_modifier_group SET menu_id=?,modifier_group_id=?,is_required=?,status=?,is_deleted=?,created_at=?,updated_at=?  WHERE id=' + menu_group_id, menu_id, modifier_group_id, is_required, status, is_deleted, created_at, updated_at);
				//}

				// }
			}
		}
		if (resultData.hasOwnProperty("serving")) {
			//Ti.API.info('*serving* '+JSON.stringify(resultData.serving));
			for (var i = 0; i < resultData.serving.length; i++) {

				var serving_Data = db.execute('SELECT id FROM ospos_serving where id=' + resultData.serving[i].id);

				var serving_id = parseInt(resultData.serving[i].id);
				var serving_name = resultData.serving[i].serving_name;
				var serving_description = resultData.serving[i].serving_description;
				var serving_sort = resultData.serving[i].serving_sort;
				var status = resultData.serving[i].status;
				var is_deleted = resultData.serving[i].is_deleted;
				var created_at = resultData.serving[i].created_at;
				var updated_at = resultData.serving[i].updated_at;

				if (serving_Data.getRowCount() == 0) {
					db.execute('INSERT INTO ospos_serving(id,serving_name,serving_description,serving_sort,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)', serving_id, serving_name, serving_description, serving_sort, status, is_deleted, created_at, updated_at);

				} else {
					db.execute('UPDATE ospos_serving SET serving_name=?,serving_description=?,serving_sort=?,status=?,is_deleted=?,created_at=?,updated_at=?  WHERE id=' + serving_id, serving_name, serving_description, serving_sort, status, is_deleted, created_at, updated_at);

				}
			}
		}
		if (resultData.hasOwnProperty("modifier_group")) {
			//Ti.API.info('*modifier_group*  '+JSON.stringify(resultData.modifier_group));
			for (var i = 0; i < resultData.modifier_group.length; i++) {

				var modifier_group_Data = db.execute('SELECT id FROM ospos_modifier_group where id=' + resultData.modifier_group[i].id);

				var modifier_group_id = parseInt(resultData.modifier_group[i].id);
				var modifier_group_name = resultData.modifier_group[i].modifier_group_name;
				var modifier_group_description = resultData.modifier_group[i].modifier_group_description;
				var modifier_group_sort = resultData.modifier_group[i].modifier_group_sort;
				var selection_time = resultData.modifier_group[i].selection_time;
				var status = resultData.modifier_group[i].status;
				var is_deleted = resultData.modifier_group[i].is_deleted;
				var created_at = resultData.modifier_group[i].created_at;
				var updated_at = resultData.modifier_group[i].updated_at;

				if (modifier_group_Data.getRowCount() == 0) {

					db.execute('INSERT INTO ospos_modifier_group(id,modifier_group_name,modifier_group_description,modifier_group_sort,selection_time,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)', modifier_group_id, modifier_group_name, modifier_group_description, modifier_group_sort, selection_time, status, is_deleted, created_at, updated_at);
				} else {

					db.execute('UPDATE ospos_modifier_group SET modifier_group_name=?,modifier_group_description=?,modifier_group_sort=?,selection_time=?,status=?,is_deleted=?,created_at=?,updated_at=?  WHERE id=' + modifier_group_id, modifier_group_name, modifier_group_description, modifier_group_sort, selection_time, status, is_deleted, created_at, updated_at);

				}
			}
		}
		if (resultData.hasOwnProperty("modifiers")) {
			//Ti.API.info('*modifiers* '+JSON.stringify(resultData.modifiers));
			for (var i = 0; i < resultData.modifiers.length; i++) {

				var modifiers_Data = db.execute('SELECT id FROM ospos_modifier where id=' + resultData.modifiers[i].id);

				var modifier_id = parseInt(resultData.modifiers[i].id);
				var modifier_name = resultData.modifiers[i].modifier_name;
				var modifier_description = resultData.modifiers[i].modifier_description;
				var modifier_group_id = resultData.modifiers[i].modifier_group_id;
				var modifier_apply_counter = resultData.modifiers[i].modifier_apply_counter;
				var modifier_sort = resultData.modifiers[i].modifier_sort;
				var modify_with = resultData.modifiers[i].modify_with;
				var count = 0;
				var selected = false;
				var status =  resultData.modifiers[i].status;
				var is_deleted = resultData.modifiers[i].is_deleted;
				var created_at = resultData.modifiers[i].created_at;
				var updated_at = resultData.modifiers[i].updated_at;

				if (modifiers_Data.getRowCount() == 0) {

					db.execute('INSERT INTO ospos_modifier(id,modifier_name,modifier_description,modifier_group_id,modifier_apply_counter,modifier_sort,modify_with,count,selected,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', modifier_id, modifier_name, modifier_description, modifier_group_id, modifier_apply_counter, modifier_sort, modify_with, count, selected, status, is_deleted, created_at, updated_at);

				} else {

					db.execute('UPDATE ospos_modifier SET modifier_name=?,modifier_description=?,modifier_group_id=?,modifier_apply_counter=?,modifier_sort=?,modify_with=?,count=?,selected=?,status=?,is_deleted=?,created_at=?,updated_at=?  WHERE id=' + modifier_id, modifier_name, modifier_description, modifier_group_id, modifier_apply_counter, modifier_sort, modify_with, count, selected, status, is_deleted, created_at, updated_at);

				}
			}
		}
		if (resultData.hasOwnProperty("modifier_serving_price")) {
			//Ti.API.info('*modifier_serving_price* '+JSON.stringify(resultData.modifier_serving_price));
			for (var i = 0; i < resultData.modifier_serving_price.length; i++) {

				var modifier_serving_price_Data = db.execute('SELECT id FROM ospos_serving_modifiers_price where id=' + resultData.modifier_serving_price[i].id);

				var modifier_serving_price_id = parseInt(resultData.modifier_serving_price[i].id);
				var serving_id = resultData.modifier_serving_price[i].serving_id;
				var price = resultData.modifier_serving_price[i].price;
				var modifier_id = resultData.modifier_serving_price[i].modifier_id;

				if (modifier_serving_price_Data.getRowCount() == 0) {

					db.execute('INSERT INTO ospos_serving_modifiers_price(id,serving_id,price,modifier_id) VALUES (?,?,?,?)', modifier_serving_price_id, serving_id, price, modifier_id);

				} else {

					db.execute('UPDATE ospos_serving_modifiers_price SET serving_id=?,price=?,modifier_id=?  WHERE id=' + modifier_serving_price_id, serving_id, price, modifier_id);

				}
			}
		}

		if (resultData.hasOwnProperty("menu_modifier_serving")) {
			//Ti.API.info('*menu_modifier_serving* '+JSON.stringify(resultData.menu_modifier_serving));
			for (var i = 0; i < resultData.menu_modifier_serving.length; i++) {

				var menu_modifier_serving_Data = db.execute('SELECT id FROM ospos_menu_modifier_serving where id=' + resultData.menu_modifier_serving[i].id);

				var id = parseInt(resultData.menu_modifier_serving[i].id);
				var modifier_group_id = resultData.menu_modifier_serving[i].modifier_group_id;
				var modifier_id = resultData.menu_modifier_serving[i].modifier_id;
				var serving_id = resultData.menu_modifier_serving[i].serving_id;
				var price = resultData.menu_modifier_serving[i].price;
				var menu_id = resultData.menu_modifier_serving[i].menu_id;
				var status = resultData.menu_modifier_serving[i].status;
				var created_at = resultData.menu_modifier_serving[i].created_at;
				var updated_at = resultData.menu_modifier_serving[i].updated_at;

				// if (menu_modifier_serving_Data.getRowCount() == 0) {

				db.execute('INSERT INTO ospos_menu_modifier_serving(id,serving_id,modifier_group_id,price,menu_id,status,created_at,updated_at,modifier_id) VALUES (?,?,?,?,?,?,?,?,?)', id, serving_id, modifier_group_id, price, menu_id, status, created_at, updated_at, modifier_id);
				// } else {
				//	if (resultData.menu_modifier_serving[i].status == "Active") {
				//db.execute('DELETE FROM ospos_menu_modifier_serving WHERE menu_id= ' + resultData.menu_modifier_serving[i].menu_id);
				//db.execute('INSERT INTO ospos_menu_modifier_serving(id,serving_id,modifier_group_id,price,menu_id,status,created_at,updated_at,modifier_id) VALUES (?,?,?,?,?,?,?,?,?)', id, serving_id, modifier_group_id, price, menu_id, status, created_at, updated_at, modifier_id);
				//} else {
				//db.execute('UPDATE ospos_menu_modifier_serving SET serving_id=?,modifier_group_id=?,price=?,menu_id=?,status=?,created_at=?,updated_at=?,modifier_id=?  WHERE id=' + id, serving_id, modifier_group_id, price, menu_id, status, created_at, updated_at, modifier_id);
				//}
				// }
			}
		}

		if (resultData.hasOwnProperty("menu_prefix")) {
			//Ti.API.info('*menu_prefix* '+JSON.stringify(resultData.menu_prefix));
			for (var i = 0; i < resultData.menu_prefix.length; i++) {

				var menu_prefix_Data = db.execute('SELECT id FROM ospos_menu_prefix where id=' + resultData.menu_prefix[i].id);

				var id = parseInt(resultData.menu_prefix[i].id);
				var modifier_group_id = resultData.menu_prefix[i].modifier_group_id;
				var modifier_id = resultData.menu_prefix[i].modifier_id;
				var serving_id = resultData.menu_prefix[i].serving_id;
				var price = resultData.menu_prefix[i].price;
				var menu_id = resultData.menu_prefix[i].menu_id;
				var prefix_id = resultData.menu_prefix[i].prefix_id;
				var status = resultData.menu_prefix[i].status;
				var created_at = resultData.menu_prefix[i].created_at;
				var updated_at = resultData.menu_prefix[i].updated_at;
				// if (menu_prefix_Data.getRowCount() == 0) {
				db.execute('INSERT INTO ospos_menu_prefix(id,serving_id,modifier_group_id,price,menu_id,prefix_id,status,created_at,updated_at,modifier_id) VALUES (?,?,?,?,?,?,?,?,?,?)', id, serving_id, modifier_group_id, price, menu_id, prefix_id, status, created_at, updated_at, modifier_id);
				// } else {
				//if (resultData.menu_prefix[i].status == "Active") {
				//db.execute('DELETE FROM ospos_menu_prefix WHERE menu_id= ' + resultData.menu_prefix[i].menu_id);
				//db.execute('INSERT INTO ospos_menu_prefix(id,serving_id,modifier_group_id,price,menu_id,prefix_id,status,created_at,updated_at,modifier_id) VALUES (?,?,?,?,?,?,?,?,?,?)', id, serving_id, modifier_group_id, price, menu_id, prefix_id, status, created_at, updated_at, modifier_id);
				//} else {
				//	db.execute('UPDATE ospos_menu_prefix SET serving_id=?,modifier_group_id=?,price=?,menu_id=?,prefix_id=?,status=?,created_at=?,updated_at=?,modifier_id=?  WHERE id=' + id, serving_id, modifier_group_id, price, menu_id, prefix_id, status, created_at, updated_at, modifier_id);
				//}

				// }
			}

		}

		if (resultData.hasOwnProperty("modifier_prefix")) {
			//Ti.API.info('*modifier_prefix* '+JSON.stringify(resultData.modifier_prefix));
			for (var i = 0; i < resultData.modifier_prefix.length; i++) {
				var modifier_prefix_Data = db.execute('SELECT prefix_id FROM ospos_modifier_prefix where prefix_id=' + resultData.modifier_prefix[i].prefix_id);
				var prefix_id = parseInt(resultData.modifier_prefix[i].prefix_id);
				var prefix_name = resultData.modifier_prefix[i].prefix_name;
				var prefix_price = resultData.modifier_prefix[i].prefix_price;
				var override_modifier = resultData.modifier_prefix[i].override_modifier;
				var modifier_id = resultData.modifier_prefix[i].modifier_id;
				var status = resultData.modifier_prefix[i].status;
				var is_deleted = resultData.modifier_prefix[i].is_deleted;
				var created_at = resultData.modifier_prefix[i].created_at;
				var updated_at = resultData.modifier_prefix[i].updated_at;

				if (modifier_prefix_Data.getRowCount() == 0) {
					db.execute('INSERT INTO ospos_modifier_prefix(prefix_id,prefix_name,prefix_price,override_modifier,modifier_id,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)', prefix_id, prefix_name, prefix_price, override_modifier, modifier_id, status, is_deleted, created_at, updated_at);
				} else {
					db.execute('UPDATE ospos_modifier_prefix SET prefix_name=?,prefix_price=?,override_modifier=?,modifier_id=?,status=?,is_deleted=?,created_at=?,updated_at=?  WHERE id=' + prefix_id, prefix_name, prefix_price, override_modifier, modifier_id, status, is_deleted, created_at, updated_at);
				}
			}
		}
		if (resultData.hasOwnProperty("sales")) {
			Ti.API.info('*sales*' + JSON.stringify(resultData.sales));
			for (var i = 0; i < resultData.sales.length; i++) {

				var sales_Data = db.execute('SELECT id FROM ospos_sales where id=' + resultData.sales[i].id);

				var id = resultData.sales[i].id;
				var fullname = resultData.sales[i].fullname;
				var profile_pic = resultData.sales[i].profile_pic;
				var pickup_date = resultData.sales[i].pickup_date;
				var customer_id = resultData.sales[i].customer_id;
				var employee_id = resultData.sales[i].employee_id;
				var store_id = resultData.sales[i].store_id;
				var comment = resultData.sales[i].comment;
				var invoice_number = resultData.sales[i].invoice_number;
				var discount_type = resultData.sales[i].discount_type;
				var dis_value = resultData.sales[i].dis_value;
				var subtotal = resultData.sales[i].subtotal;
				var tax = resultData.sales[i].tax;
				var tax_value = resultData.sales[i].tax_value;
				var timer = resultData.sales[i].timer;
				var accepted_at = resultData.sales[i].accepted_at;
				var status = "1";
				var accept_time = "";
				var counter_duration = "";
				var isSchedule = "1";
				var order_type = resultData.sales[i].order_type;
				var order_status = resultData.sales[i].order_status;
				var created_at = resultData.sales[i].created_at;
				var updated_at = resultData.sales[i].updated_at;
				var order_total_price = resultData.sales[i].order_total_price;
				var payment_method = resultData.sales[i].payment_method;
				var discount_total_price = resultData.sales[i].discount_total_price;
				var is_refund = resultData.sales[i].is_refund;
				var loyality_value = resultData.sales[i].loyality_value;
				var loyality_point = resultData.sales[i].loyality_point;
				var pickup_type = resultData.sales[i].pickup_type;
				var trans_num = resultData.sales[i].trans_num;
				var order_token = resultData.sales[i].order_token;
				var givex_code = resultData.sales[i].givex_code;
				var givex_num = resultData.sales[i].givex_num;
				if (sales_Data.getRowCount() == 0) {
					db.execute('INSERT INTO ospos_sales(id,fullname,profile_pic,pickup_date,customer_id,employee_id,store_id,comment,invoice_number,discount_type,dis_value,subtotal,tax,tax_value, timer,accepted_at, status, accept_time ,counter_duration,isSchedule,order_type,order_status, created_at,updated_at,order_total_price,payment_method,discount_total_price,is_refund,loyality_value,loyality_point,pickup_type,trans_num,order_token,givex_code,givex_num) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', id, fullname, profile_pic, pickup_date, customer_id, employee_id, store_id, comment, invoice_number, discount_type, dis_value, subtotal, tax, tax_value, timer, accepted_at, status, accept_time, counter_duration, isSchedule, order_type, order_status, created_at, updated_at, order_total_price, payment_method, discount_total_price, is_refund, loyality_value, loyality_point, pickup_type, trans_num, order_token, givex_code, givex_num);
				} else {
					db.execute('UPDATE ospos_sales SET fullname=?,profile_pic=?,pickup_date=?,customer_id=?,employee_id=?,store_id=?,comment=?,invoice_number=?,discount_type=?,dis_value=?,subtotal=?,tax=?,tax_value=?,timer=?,accepted_at=?,status=?,accept_time=?,counter_duration=?,isSchedule=?, order_type=?,order_status=?,created_at=?,updated_at=?,order_total_price=?,payment_method=?,discount_total_price=?,is_refund=?,loyality_value=?,loyality_point=?,pickup_type=?,trans_num=?,order_token=?,givex_code=?,givex_num=? WHERE id=' + id, fullname, profile_pic, pickup_date, customer_id, employee_id, store_id, comment, invoice_number, discount_type, dis_value, subtotal, tax, tax_value, timer, accepted_at, status, accept_time, counter_duration, isSchedule, order_type, order_status, created_at, updated_at, order_total_price, payment_method, discount_total_price, is_refund, loyality_value, loyality_point, pickup_type, trans_num, order_token, givex_code, givex_num);
				}

			}
		}

		if (resultData.hasOwnProperty("sales_items")) {
			Ti.API.info('*sales_items*' + JSON.stringify(resultData.sales_items));
			for (var i = 0; i < resultData.sales_items.length; i++) {

				var sales_items_Data = db.execute('SELECT id FROM ospos_sales_items where id=' + resultData.sales_items[i].id);

				var sale_id = parseInt(resultData.sales_items[i].sale_id);
				var id = resultData.sales_items[i].id;
				var category_id = resultData.sales_items[i].category_id;
				var menu_id = resultData.sales_items[i].menu_id;
				var category_name = resultData.sales_items[i].category_name;
				var menu_name = resultData.sales_items[i].menu_name;
				var menu_discount = resultData.sales_items[i].menu_discount;
				var serving_id = resultData.sales_items[i].serving_id;
				var serving_name = resultData.sales_items[i].serving_name;
				var serving_price = resultData.sales_items[i].serving_price;
				var quantity_purchased = resultData.sales_items[i].quantity_purchased;
				var order_details = "" + JSON.stringify(resultData.sales_items[i].order_details);
				var created_at = resultData.sales_items[i].created_at;
				var updated_at = resultData.sales_items[i].updated_at;

				var discount_type = resultData.sales_items[i].discount_type;
				var apply_option = resultData.sales_items[i].apply_option;
				var discount_rate = resultData.sales_items[i].discount_rate;
				var discount_id = resultData.sales_items[i].discount_id;
				var discount_title = resultData.sales_items[i].discount_title;
				var discount_price = resultData.sales_items[i].discount_price;
				var item_coustomized_price = resultData.sales_items[i].item_coustomized_price;
				if (sales_items_Data.getRowCount() == 0) {

					db.execute('INSERT INTO ospos_sales_items(sale_id,id,category_id,menu_id,category_name,menu_name,menu_discount,serving_id,serving_name,serving_price,quantity_purchased,order_details,created_at,updated_at,discount_type,apply_option,discount_rate,discount_id,discount_title,discount_price,item_coustomized_price) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', sale_id, id, category_id, menu_id, category_name, menu_name, menu_discount, serving_id, serving_name, serving_price, quantity_purchased, order_details, created_at, updated_at, discount_type, apply_option, discount_rate, discount_id, discount_title, discount_price, item_coustomized_price);
				} else {
					db.execute('UPDATE ospos_sales_items SET sale_id=?,category_id=?,menu_id=?,category_name=?,menu_name=?,menu_discount=?,serving_id=?,serving_name=?,serving_price=?,quantity_purchased=?,order_details=?,created_at=?,updated_at=?,discount_type=?,apply_option=?,discount_rate=?,discount_id=?,discount_title=?,discount_price=?,item_coustomized_price=? WHERE id=' + id, sale_id, category_id, menu_id, category_name, menu_name, menu_discount, serving_id, serving_name, serving_price, quantity_purchased, order_details, created_at, updated_at, discount_type, apply_option, discount_rate, discount_id, discount_title, discount_price, item_coustomized_price);
				}
			}
		}

		if (resultData.hasOwnProperty("discount")) {
			//Ti.API.info('*sales_items*' + JSON.stringify(resultData.sales_items));
			for (var i = 0; i < resultData.discount.length; i++) {

				var discount_Data = db.execute('SELECT id FROM ospos_discount where id=' + resultData.discount[i].id);

				var id = parseInt(resultData.discount[i].id);
				var title = resultData.discount[i].title;
				var category_id = resultData.discount[i].category_id;
				var menu_id = resultData.discount[i].menu_id;
				var quantity = resultData.discount[i].quantity;
				var serving_sizes_id = resultData.discount[i].serving_sizes_id;
				var discount_type = resultData.discount[i].discount_type;
				var discount_rate = resultData.discount[i].discount_rate;
				var start_date = resultData.discount[i].start_date;
				var end_date = resultData.discount[i].end_date;
				var start_time = resultData.discount[i].start_time;
				var end_time = resultData.discount[i].end_time;
				var apply_option = resultData.discount[i].apply_option;
				var coupon_code = resultData.discount[i].coupon_code;
				var combine_discount = resultData.discount[i].combine_discount;
				var discount_repeat = resultData.discount[i].discount_repeat;
				var discount_start = JSON.stringify(resultData.discount[i].discount_start);
				var discount_end = JSON.stringify(resultData.discount[i].discount_end);
				var status = resultData.discount[i].status;
				var is_deleted = resultData.discount[i].is_deleted;
				var created_at = resultData.discount[i].created_at;
				var updated_at = resultData.discount[i].updated_at;

				if (discount_Data.getRowCount() == 0) {

					db.execute('INSERT INTO ospos_discount(id,title,category_id,menu_id,quantity,serving_sizes_id,discount_type,discount_rate,start_date,end_date,start_time,end_time,apply_option,coupon_code,combine_discount,discount_repeat,discount_start,discount_end,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', id, title, category_id, menu_id, quantity, serving_sizes_id, discount_type, discount_rate, start_date, end_date, start_time, end_time, apply_option, coupon_code, combine_discount, discount_repeat, discount_start, discount_end, status, is_deleted, created_at, updated_at);
				} else {
					db.execute('UPDATE ospos_discount SET title=?,category_id=?,menu_id=?,quantity=?,serving_sizes_id=?,discount_type=?,discount_rate=?,start_date=?,end_date=?,start_time=?,end_time=?,apply_option=?,coupon_code=?,combine_discount=?,discount_repeat=?,discount_start=?,discount_end=?,status=?,is_deleted=?,created_at=?,updated_at=? WHERE id=' + id, title, category_id, menu_id, quantity, serving_sizes_id, discount_type, discount_rate, start_date, end_date, start_time, end_time, apply_option, coupon_code, combine_discount, discount_repeat, discount_start, discount_end, status, is_deleted, created_at, updated_at);
				}
			}
		}

		if (resultData.hasOwnProperty("till_management")) {
			Ti.API.info('*till_management*' + JSON.stringify(resultData.till_management));
			for (var i = 0; i < resultData.till_management.length; i++) {

				var till_management_Data = db.execute('SELECT id FROM ospos_tillmanagement where id=' + resultData.till_management[i].id);
				var date = resultData.till_management[i].date;
				var a = date.toString().replace(" ", "T");
				var dateTime = new Date(a).getTime();
				var calculateTime = (dateTime + new Date(dateTime).getTimezoneOffset() * 60 * 1000);

				var id = resultData.till_management[i].id;
				var employee_id = resultData.till_management[i].employee_id;
				var description = resultData.till_management[i].description;
				var amount = resultData.till_management[i].amount;
				var pay_type = resultData.till_management[i].pay_type;
				var pay_for = resultData.till_management[i].pay_for;
				var is_deleted = resultData.till_management[i].is_deleted;
				var date = calculateTime;
				var updated_at = resultData.till_management[i].updated_at;
				var employee_name = resultData.till_management[i].employee_name;
				var employee_image = resultData.till_management[i].employee_image;
				if (till_management_Data.getRowCount() == 0) {
					db.execute('INSERT INTO ospos_tillmanagement(id,employee_id,description,amount,pay_type,pay_for,is_deleted,date,updated_at,employee_name,employee_image) VALUES (?,?,?,?,?,?,?,?,?,?,?)', id, employee_id, description, amount, pay_type, pay_for, is_deleted, date, updated_at, employee_name, employee_image);

				} else {
					db.execute('UPDATE ospos_tillmanagement SET employee_id=?,description=?,amount=?,pay_type=?,pay_for=?,is_deleted=?,date=?,updated_at=?,employee_name=?,employee_image=? WHERE id=' + id, employee_id, description, amount, pay_type, pay_for, is_deleted, date, updated_at, employee_name, employee_image);

				}
			}
		}
		if (resultData.hasOwnProperty("register_sync")) {
			Ti.API.info('*register_sync*' + JSON.stringify(resultData.register_sync));
			for (var i = 0; i < resultData.register_sync.length; i++) {

				var date = resultData.register_sync[i].updated_date;
				var a = date.toString().replace(" ", "T");
				var dateTime = new Date(a).getTime();
				var calculateTime = (dateTime + new Date(dateTime).getTimezoneOffset() * 60 * 1000);

				var openingDate = resultData.register_sync[i].opening_time;
				var a = openingDate.toString().replace(" ", "T");
				var time = new Date(a).getTime();
				var openTime = (time + new Date(time).getTimezoneOffset() * 60 * 1000);

				var closing_timeDate = resultData.register_sync[i].closing_time;
				var a = closing_timeDate.toString().replace(" ", "T");
				var closing_time = new Date(a).getTime();
				var closingTime = (closing_time + new Date(closing_time).getTimezoneOffset() * 60 * 1000);

				var register_sync_Data = db.execute('SELECT id FROM ospos_register where id=' + resultData.register_sync[i].id);
				var id = resultData.register_sync[i].id;
				var opening_time = openTime;
				var opening_note = resultData.register_sync[i].opening_note;
				var previous_day_amount = resultData.register_sync[i].previous_day_amount;
				var cash_expected_amount = resultData.register_sync[i].cash_expected_amount;
				var cash_found = resultData.register_sync[i].cash_found;
				var cash_difference = resultData.register_sync[i].cash_difference;
				var card_expected_amount = resultData.register_sync[i].card_expected_amount;
				var card_found = resultData.register_sync[i].card_found;
				var card_difference = resultData.register_sync[i].card_found;
				var giftcard_expected_amount = resultData.register_sync[i].giftcard_expected_amount;
				var giftcard_found = resultData.register_sync[i].giftcard_found;
				var giftcard_difference = resultData.register_sync[i].giftcard_difference;
				var closing_note = resultData.register_sync[i].closing_note;
				var closing_time = closingTime;
				var status = resultData.register_sync[i].status;
				var updated_date = calculateTime;

				if (register_sync_Data.getRowCount() == 0) {

					db.execute('INSERT INTO ospos_register(id, opening_time, opening_note,previous_day_amount,cash_expected_amount,cash_found,cash_difference,card_expected_amount,card_found,card_difference,giftcard_expected_amount,giftcard_found,giftcard_difference,closing_note,closing_time,status,updated_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', id, opening_time, opening_note, previous_day_amount, cash_expected_amount, cash_found, cash_difference, card_expected_amount, card_found, card_difference, giftcard_expected_amount, giftcard_found, giftcard_difference, closing_note, closing_time, status, updated_date);

				} else {
					db.execute('UPDATE ospos_register SET opening_time=?,opening_note=?,previous_day_amount=?,cash_expected_amount=?,cash_found=?,cash_difference=?,card_expected_amount=?,card_found=?,card_difference=?,giftcard_expected_amount=?,giftcard_found=?,giftcard_difference=?,closing_note=?,closing_time=?,status=?,updated_date=? WHERE id=' + id, opening_time, opening_note, previous_day_amount, cash_expected_amount, cash_found, cash_difference, card_expected_amount, card_found, card_difference, giftcard_expected_amount, giftcard_found, giftcard_difference, closing_note, closing_time, status, updated_date);

				}
			}
		}

		/*
		 if (resultData.hasOwnProperty("sales_payments")) {
		 //Ti.API.info('*sales_payments*');
		 for (var i = 0; i < resultData.sales_payments.length; i++) {

		 var sales_payments_Data = db.execute('SELECT id FROM ospos_sales_payments where id=' + resultData.sales_payments[i].id);

		 var sale_id = parseInt(resultData.sales_payments[i].sale_id);
		 var payment_type = resultData.sales_payments[i].payment_type;
		 var payment_amount = resultData.sales_payments[i].payment_amount;

		 if (sales_payments_Data.getRowCount() == 0) {
		 db.execute('INSERT INTO ospos_sales_payments(sale_id,payment_type,payment_amount) VALUES (?,?,?)', sale_id, payment_type, payment_amount);
		 } else {
		 db.execute('UPDATE ospos_sales_payments SET sale_id=?,payment_type=?,payment_amount=? WHERE id=' + sale_id, payment_type, payment_amount);
		 }

		 }

		 }*/
		if (resultData.hasOwnProperty("taxes")) {

			for (var i = 0; i < resultData.taxes.length; i++) {

				var taxesData = db.execute('SELECT id FROM ospos_tax_codes where id=' + resultData.taxes[i].id);
				var id = resultData.taxes[i].id;
				var tax_code = resultData.taxes[i].tax_code;
				var tax_code_name = resultData.taxes[i].tax_code_name;
				var tax_rate = resultData.taxes[i].tax_rate;
				var status = resultData.taxes[i].status;
				var is_deleted = resultData.taxes[i].is_deleted;
				var created_at = resultData.taxes[i].created_at;
				var updated_at = resultData.taxes[i].updated_at;
				// if (taxesData.getRowCount() == 0) {
				db.execute('DELETE FROM ospos_tax_codes');
				db.execute('INSERT INTO ospos_tax_codes(id, tax_code, tax_code_name,tax_rate,status,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)', id, tax_code, tax_code_name, tax_rate, status, is_deleted, created_at, updated_at);
				// } else {
				// db.execute('UPDATE ospos_tax_codes SET tax_code=?,tax_code_name=?,tax_rate=?,status=?,is_deleted=?,created_at=?,updated_at=? WHERE id=' + id, tax_code, tax_code_name, tax_rate, status, is_deleted, created_at, updated_at);
				// }
			}
		}
		if (resultData.hasOwnProperty("permissions")) {
			Ti.API.info('resultData.permissions ' + JSON.stringify(resultData.permissions));
			db.execute('DELETE FROM ospos_permission');
			Ti.API.info(JSON.stringify(resultData.permissions));
			db.execute('INSERT INTO ospos_permission (permissions) VALUES (?)', JSON.stringify(resultData.permissions));
		}

		///------------
		if (resultData.hasOwnProperty("printer_configuration")) {
			for (var i = 0; i < resultData.printer_configuration.length; i++) {

				var printer_sync_Data = db.execute('SELECT id FROM ospos_receipt_template where id=' + resultData.printer_configuration[i].id);
				var id = resultData.printer_configuration[i].id;
				var template_type = resultData.printer_configuration[i].template_type;
				var store_id = resultData.printer_configuration[i].store_id;
				var settings = resultData.printer_configuration[i].settings;
				var created_at = resultData.printer_configuration[i].created_at;
				var updated_at = resultData.printer_configuration[i].updated_at;

				if (printer_sync_Data.getRowCount() == 0) {

					db.execute('INSERT INTO ospos_receipt_template(id, template_type, store_id,settings,created_at,updated_at) VALUES (?,?,?,?,?,?)', id, template_type, store_id, settings, created_at, updated_at);

				} else {
					db.execute('UPDATE ospos_receipt_template SET template_type=?,store_id=?,settings=?,created_at=?,updated_at=? WHERE id=' + id, template_type, store_id, settings, created_at, updated_at);

				}
			}
		}
		if (resultData.hasOwnProperty("split_orders")) {
			Ti.API.info('*split_orders  *' + JSON.stringify(resultData.split_orders));
			for (var i = 0; i < resultData.split_orders.length; i++) {

				var split_Data = db.execute('SELECT id FROM ospos_split_orders where id=' + resultData.split_orders[i].id);
				var id = resultData.split_orders[i].id;
				var sale_id = resultData.split_orders[i].sale_id;
				var amount = resultData.split_orders[i].amount;
				var payment_method = resultData.split_orders[i].payment_method;
				var trans_num = resultData.split_orders[i].trans_num;
				var givex_code = resultData.split_orders[i].givex_code;
				var givex_num = resultData.split_orders[i].givex_num;
				var is_deleted = resultData.split_orders[i].is_deleted;
				var is_refund = resultData.split_orders[i].is_refund;
				var method = resultData.split_orders[i].method;
				var created_at = resultData.split_orders[i].created_at;
				var updated_at = resultData.split_orders[i].updated_at;

				if (split_Data.getRowCount() == 0) {
					db.execute('INSERT INTO ospos_split_orders(id, sale_id, amount, payment_method, is_deleted, created_at, updated_at,is_refund,method,trans_num,givex_code,givex_num) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', id, sale_id, amount, payment_method, is_deleted, created_at, updated_at, is_refund, method, trans_num, givex_code, givex_num);
				} else {
					db.execute('UPDATE ospos_split_orders SET sale_id=?,amount=?,payment_method=?,is_deleted=?,created_at=?,updated_at=?,is_refund=?,method=?,trans_num=?,givex_code=?,givex_num=? WHERE id=' + id, sale_id, amount, payment_method, is_deleted, created_at, updated_at, is_refund, method, trans_num, givex_code, givex_num);
				}
			}
		}

	} catch(dberror) {
		Ti.API.info('dberror tax' + dberror.message);
		tracker.addException({
			description : "DBManager1: " + dberror.message,
			fatal : false
		});
	}

	db.close();
	Ti.API.info('db close');

};
exports.getPaymentDetailFromDB1 = function(sale_id) {

	Ti.API.info("********************************in get payment detail****************************");
	var paymentDetail = [];
	var resultSet;
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_split_orders where sale_id=' + parseInt(sale_id));
		Ti.API.info('SELECT * FROM ospos_split_orders where sale_id=' + parseInt(sale_id));
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.sale_id = resultSet.fieldByName('sale_id');
			dataobj.amount = resultSet.fieldByName('amount');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.is_deleted = resultSet.fieldByName('is_deleted');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.method = resultSet.fieldByName('method');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			paymentDetail.push(dataobj);

			resultSet.next();
		}

		Ti.API.info('paymentDetail DB Data ' + JSON.stringify(paymentDetail));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager10: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return paymentDetail;
};
exports.getPermissionsFromDB = function() {
	var permission = null;
	var resultSet;
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_permission');
		permission = resultSet.fieldByName('permissions');
	} catch(err) {
		Ti.API.info('Error Permission ' + err.message);
		tracker.addException({
			description : "DBManager3: " + err.message,
			fatal : false
		});
	} finally {
		try {
			resultSet.close();
		} catch(e) {
		}

		db.close();
	}
	return permission;
};
exports.getTaxDataFromDB = function() {
	var taxes = {};
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_tax_codes');

		while (resultSet.isValidRow()) {

			if (resultSet.fieldByName('is_deleted') != "1" && resultSet.fieldByName('status') == "Active") {
				taxes.id = resultSet.fieldByName('id');
				taxes.tax_code = resultSet.fieldByName('tax_code');
				taxes.tax_code_name = resultSet.fieldByName('tax_code_name');
				taxes.tax_rate = resultSet.fieldByName('tax_rate');
			}
			resultSet.next();
		}
		//Ti.API.info('Tax DB Data ' + JSON.stringify(taxes));
	} catch(err) {
		Ti.API.info('Error tax ' + err.message);
		tracker.addException({
			description : "DBManager3: " + err.message,
			fatal : false
		});

	} finally {
		try {
			resultSet.close();
		} catch(e) {
		}

		db.close();
	}
	return taxes;
};

exports.Get_Category_Data_From_DB = function() {

	//Ti.API.info("********************************in get Category****************************");

	var categoryItem = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_cat ORDER BY category_sort');

		while (resultSet.isValidRow()) {

			var dataobj = {};
			dataobj.id = resultSet.fieldByName('id');
			dataobj.category_name = resultSet.fieldByName('category_name');
			dataobj.category_description = resultSet.fieldByName('category_description');
			dataobj.category_image = resultSet.fieldByName('category_image');
			dataobj.category_sort = resultSet.fieldByName('category_sort');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.is_deleted = resultSet.fieldByName('is_deleted');
			if (resultSet.fieldByName('is_deleted') != "1" && resultSet.fieldByName('status') == "Active") {
				categoryItem.push(dataobj);
			}

			resultSet.next();
		}
		//Ti.API.info('Category DB Data ' + JSON.stringify(categoryItem));
	} catch(err) {
		Ti.API.info('Error Category ' + err.message);
		tracker.addException({
			description : "DBManager4: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return categoryItem;
};

exports.Get_Menu_Data_From_DB = function(category_id) {

	var menuItem = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_menus where category_id=' + category_id + " ORDER BY menu_sort ");
		Ti.API.info('SELECT FROM ospos_menus ' + category_id);

		while (resultSet.isValidRow()) {

			var dataobj = {};
			dataobj.id = resultSet.fieldByName('id');
			dataobj.qty = 1;
			dataobj.menu_name = resultSet.fieldByName('menu_name');
			dataobj.menu_alias = resultSet.fieldByName('menu_alias');
			dataobj.category_name = resultSet.fieldByName('category_name');
			dataobj.menu_description = resultSet.fieldByName('menu_description');
			dataobj.menu_image = resultSet.fieldByName('menu_image');
			dataobj.category_id = resultSet.fieldByName('category_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.created_by_id = resultSet.fieldByName('created_by_id');
			dataobj.menu_sort = resultSet.fieldByName('menu_sort');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.is_deleted = resultSet.fieldByName('is_deleted');
			if (resultSet.fieldByName('is_deleted') != "1" && resultSet.fieldByName('status') == "Active") {
				menuItem.push(dataobj);
			}
			resultSet.next();
		}
		// Ti.API.info('Category Menus DB Data ' + JSON.stringify(menuItem));
	} catch(err) {
		Ti.API.info('Error Menu Get DB ' + err.message);
		tracker.addException({
			description : "DBManager5: " + err.message,
			fatal : false
		});
	} finally {
		if (resultSet) {
			resultSet.close();
		}

		db.close();
	}

	return menuItem;
};
exports.Get_Menu_Search_Data_From_DB = function(search_data) {

	var menuItem = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		//resultSet = db.execute('SELECT * FROM ospos_menus where LOWER(menu_name) like LOWER('+"%" +  + "%"+')');
		resultSet = db.execute("select * from ospos_menus where lower(menu_name) like " + "lower('%" + search_data + "%')" + " OR lower(menu_alias) like " + "lower('%" + search_data + "%')");

		//Ti.API.info('SELECT * FROM ospos_menus where menu_name LIKE %' + search_data + "%");

		while (resultSet.isValidRow()) {

			var dataobj = {};
			dataobj.id = resultSet.fieldByName('id');
			dataobj.qty = 1;
			dataobj.menu_name = resultSet.fieldByName('menu_name');
			dataobj.category_name = resultSet.fieldByName('category_name');
			dataobj.menu_alias = resultSet.fieldByName('menu_alias');
			//dataobj.menu_alias ="";
			dataobj.menu_description = resultSet.fieldByName('menu_description');
			dataobj.menu_image = resultSet.fieldByName('menu_image');
			dataobj.category_id = resultSet.fieldByName('category_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.created_by_id = resultSet.fieldByName('created_by_id');
			dataobj.menu_sort = resultSet.fieldByName('menu_sort');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.is_deleted = resultSet.fieldByName('is_deleted');
			if (resultSet.fieldByName('is_deleted') != "1" && resultSet.fieldByName('status') == "Active") {
				menuItem.push(dataobj);
			}
			resultSet.next();
		}
		Ti.API.info('Search MENU ' + JSON.stringify(menuItem));
	} catch(err) {
		Ti.API.info('Error Menu Get DB ' + err.message);
		tracker.addException({
			description : "DBManager5: " + err.message,
			fatal : false
		});
	} finally {
		if (resultSet) {
			resultSet.close();
		}

		db.close();
	}

	return menuItem;
};

exports.Get_Menu_Serving_From_DB = function(menu_id) {

	// Ti.API.info("********************************in get Menu Serving****************************");

	var menu_serving = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_menu_serving where menu_id=' + menu_id + ' GROUP BY serving_id');
		//Ti.API.info('SELECT FROM ospos_menu_serving ' + resultSet.getRowCount());

		while (resultSet.isValidRow()) {

			var dataobj = {};
			dataobj.id = resultSet.fieldByName('id');
			dataobj.menu_id = resultSet.fieldByName('menu_id');
			dataobj.serving_id = resultSet.fieldByName('serving_id');
			dataobj.price = resultSet.fieldByName('price');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.is_deleted = resultSet.fieldByName('is_deleted');
			if (resultSet.fieldByName('is_deleted') != "1" && resultSet.fieldByName('status') == "Active") {
				menu_serving.push(dataobj);
			}
			resultSet.next();
		}
		//Ti.API.info('menu_serving DB Data ' + JSON.stringify(menu_serving));
	} catch(err) {
		Ti.API.info('Error menu_serving ' + err.message);
		tracker.addException({
			description : "DBManager6: " + err.message,
			fatal : false
		});
	} finally {
		if (resultSet) {
			resultSet.close();
		}

		db.close();
	}

	return menu_serving;
};

exports.Get_Serving_From_DB = function(serving_id) {

	// Ti.API.info("********************************in get Menu****************************");

	var serving = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_serving where id=' + serving_id);
		// Ti.API.info('SELECT FROM ospos_serving ' + serving_id);

		//while (resultSet.isValidRow()) {

		var dataobj = {};
		dataobj.id = resultSet.fieldByName('id');
		dataobj.serving_name = resultSet.fieldByName('serving_name');
		dataobj.serving_description = resultSet.fieldByName('serving_description');
		dataobj.serving_sort = resultSet.fieldByName('serving_sort');
		dataobj.status = resultSet.fieldByName('status');
		dataobj.is_deleted = resultSet.fieldByName('is_deleted');
		if (resultSet.fieldByName('is_deleted') != "1" && resultSet.fieldByName('status') == "Active") {
			serving.push(dataobj);
		}
		//resultSet.next();
		//}
		//Ti.API.info('ospos_serving DB Data ' + JSON.stringify(dataobj));
	} catch(err) {
		Ti.API.info('Error serving ' + err.message);
		tracker.addException({
			description : "DBManager7: " + err.message,
			fatal : false
		});
	} finally {
		if (resultSet) {
			resultSet.close();
		}

		db.close();
	}

	return dataobj;
};

//Below two function for getting modifiers group and its modifiers
exports.Get_Menu_Modifier_Group_From_DB = function(menu_id) {

	// Ti.API.info("********************************in get Menu Modifier Group****************************");

	var menu_modifier_group = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_menu_modifier_group where menu_id=' + menu_id + ' GROUP BY modifier_group_id');
		// Ti.API.info('SELECT FROM ospos_menu_modifier_group ' + menu_id);

		while (resultSet.isValidRow()) {

			var dataobj = {};
			dataobj.id = resultSet.fieldByName('id');
			dataobj.menu_id = resultSet.fieldByName('menu_id');
			dataobj.modifier_group_id = resultSet.fieldByName('modifier_group_id');
			dataobj.is_required = resultSet.fieldByName('is_required');
			// Ti.API.info('menu_modifier_group ' + JSON.stringify(dataobj));
			if (resultSet.fieldByName('is_deleted') != "1" && resultSet.fieldByName('status') == "Active") {
				menu_modifier_group.push(dataobj);
			}
			resultSet.next();
		};
		Ti.API.info('menu_modifier_group DB Data ' + JSON.stringify(menu_modifier_group));
	} catch(err) {
		Ti.API.info('Error menu_modifier_group ' + err.message);
		tracker.addException({
			description : "DBManager8: " + err.message,
			fatal : false
		});
	} finally {
		if (resultSet) {
			resultSet.close();
		}

		db.close();
	}

	return menu_modifier_group;
};

exports.Get_Menu_Group_From_DB = function(modifier_group_id, menuId) {

	// Ti.API.info("********************************in get ospos_modifier_group****************************");
	var modifierArray = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_modifier_group where id=' + modifier_group_id + " ORDER BY modifier_group_sort ");

		// if (resultSet.fieldByName('is_deleted') != "1" && resultSet.fieldByName('status') == "Active") {
		// Ti.API.info('SELECT FROM ospos_modifier_group ' + modifier_group_id);
		var dataobj = {};
		dataobj.id = resultSet.fieldByName('id');
		dataobj.modifier_group_name = resultSet.fieldByName('modifier_group_name');
		dataobj.modifier_group_description = resultSet.fieldByName('modifier_group_description');
		dataobj.modifier_group_sort = resultSet.fieldByName('modifier_group_sort');
		dataobj.selection_time = resultSet.fieldByName('selection_time');

		modifier_ResultSet = db.execute('SELECT * FROM ospos_modifier where modifier_group_id=' + resultSet.fieldByName('id') + " ORDER BY modifier_sort");
		while (modifier_ResultSet.isValidRow()) {
			var modifierobj = {};
			modifierobj.id = modifier_ResultSet.fieldByName('id');
			modifierobj.modifier_id = modifier_ResultSet.fieldByName('id');
			modifierobj.modifier_name = modifier_ResultSet.fieldByName('modifier_name');
			modifierobj.modifier_group_id = modifier_ResultSet.fieldByName('modifier_group_id');
			modifierobj.modifier_sort = modifier_ResultSet.fieldByName('modifier_sort');
			modifierobj.modifier_apply_counter = modifier_ResultSet.fieldByName('modifier_apply_counter');
			modifierobj.modify_with = modifier_ResultSet.fieldByName('modify_with');
			modifierobj.status = modifier_ResultSet.fieldByName('status');
			modifierobj.count = 0;
			modifierobj.modifier_price = 0;
			modifierobj.modifier_prefix_name = "";
			modifierobj.quantity = 1;
			modifierobj.selected = false;
			modifierobj.enabled = true;
			Ti.API.info('Status*** '+ modifier_ResultSet.fieldByName('status'));
			if (modifier_ResultSet.fieldByName('is_deleted') != "1"  && modifier_ResultSet.fieldByName('status') == "Active") {

				var menu_modifier_serving_ResultSet = db.execute('SELECT * FROM ospos_menu_modifier_serving where modifier_group_id=' + resultSet.fieldByName('id') + ' AND modifier_id=' + modifier_ResultSet.fieldByName('id') + ' AND menu_id=' + menuId + ' GROUP BY serving_id');
				var modifier_serving_array = [];

				while (menu_modifier_serving_ResultSet.isValidRow()) {
					var modifierServingObj = {};
					var serving_name_data = db.execute('SELECT * FROM ospos_serving where id=' + menu_modifier_serving_ResultSet.fieldByName('serving_id'));
					// Ti.API.info('SELECT * FROM ospos_serving where id=' + menu_modifier_serving_ResultSet.fieldByName('serving_id'));
					modifierServingObj.serving_id = menu_modifier_serving_ResultSet.fieldByName('serving_id');
					modifierServingObj.serving_name = serving_name_data.fieldByName('serving_name');

					modifierServingObj.menu_price = menu_modifier_serving_ResultSet.fieldByName('price');
					modifierServingObj.price = menu_modifier_serving_ResultSet.fieldByName('price');
					modifier_prefix_data = db.execute('SELECT * FROM ospos_menu_prefix where modifier_group_id=' + resultSet.fieldByName('id') + ' AND modifier_id=' + modifier_ResultSet.fieldByName('id') + ' AND menu_id=' + menuId + ' AND serving_id=' + menu_modifier_serving_ResultSet.fieldByName('serving_id'));
					var prefix_data = [];
					while (modifier_prefix_data.isValidRow()) {
						var modifier_prefix_ResultSet = db.execute('SELECT * FROM ospos_modifier_prefix where prefix_id=' + modifier_prefix_data.fieldByName('prefix_id') + ' GROUP BY prefix_id');
						// Ti.API.info(modifier_prefix_ResultSet.getRowCount());
						while (modifier_prefix_ResultSet.isValidRow()) {
							var prefix_obj = {};
							prefix_obj.prefix_id = modifier_prefix_ResultSet.fieldByName('prefix_id');
							prefix_obj.prefix_name = modifier_prefix_ResultSet.fieldByName('prefix_name');
							prefix_obj.override_modifier = modifier_prefix_ResultSet.fieldByName('override_modifier');
							var get_prefix_price_data = db.execute('SELECT * FROM ospos_menu_prefix where prefix_id=' + modifier_prefix_ResultSet.fieldByName('prefix_id') + ' GROUP BY serving_id');

							prefix_obj.prefix_price = modifier_prefix_data.fieldByName('price');
							prefix_data.push(prefix_obj);
							modifier_prefix_ResultSet.next();
						}
						modifier_prefix_data.next();
					};
					modifierServingObj.prefixData = prefix_data;
					modifier_serving_array.push(modifierServingObj);
					modifierobj.modifier_serving = modifier_serving_array;

					menu_modifier_serving_ResultSet.next();
				}

				modifierArray.push(modifierobj);
			}
			modifier_ResultSet.next();
		}
		dataobj.modifier = modifierArray;
		// }

		Ti.API.info('**Modifier Group DB Data** ' + JSON.stringify(dataobj));
	} catch(err) {
		Ti.API.info('Error ospos_modifier_group ' + err.message);
		tracker.addException({
			description : "DBManager9: " + err.message,
			fatal : false
		});
	} finally {
		if (resultSet) {
			resultSet.close();
		}

		db.close();
	}

	return dataobj;
};

exports.Get_Sale_From_DB = function(storeId) {

	Ti.API.info("********************************in get NewOrder orderHistory1****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_sales where order_status IN ("pending", "new","ready","preparing") ORDER BY id DESC');
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.accepted_at = resultSet.fieldByName('accepted_at');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		//Ti.API.info('New Order List DB Data ' + JSON.stringify(order));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager10: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};
exports.Get_OrderDetail_From_DB = function(sale_id) {

	//Ti.API.info("********************************in get orderDetail****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_sales_items where sale_id=' + sale_id);

		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.sale_id = resultSet.fieldByName('sale_id');
			dataobj.id = resultSet.fieldByName('id');
			dataobj.category_id = resultSet.fieldByName('category_id');
			dataobj.menu_id = resultSet.fieldByName('menu_id');
			dataobj.category_name = resultSet.fieldByName('category_name');
			dataobj.menu_name = resultSet.fieldByName('menu_name');
			dataobj.menu_discount = resultSet.fieldByName('menu_discount');
			dataobj.serving_id = resultSet.fieldByName('serving_id');
			dataobj.serving_name = resultSet.fieldByName('serving_name');
			dataobj.serving_price = resultSet.fieldByName('serving_price');
			dataobj.quantity_purchased = resultSet.fieldByName('quantity_purchased');
			dataobj.order_details = resultSet.fieldByName('order_details');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.apply_option = resultSet.fieldByName('apply_option');
			dataobj.discount_rate = resultSet.fieldByName('discount_rate');
			dataobj.discount_id = resultSet.fieldByName('discount_id');
			dataobj.discount_title = resultSet.fieldByName('discount_title');
			dataobj.discount_price = resultSet.fieldByName('discount_price');
			dataobj.item_coustomized_price = resultSet.fieldByName('item_coustomized_price');
			order.push(dataobj);

			resultSet.next();

		}
	} catch(err) {
		tracker.addException({
			description : "DBManager11: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};
exports.Get_Sale_Progress_From_DB = function(sale_id) {

	//	Ti.API.info("********************************in get orderHistory2 ****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_sales where id=' + sale_id);
		//Ti.API.info("resultSet.getRowCount()= " + resultSet.getRowCount());
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.accepted_at = resultSet.fieldByName('accepted_at');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		//Ti.API.info('Order List DB Data ' + JSON.stringify(order));
	} catch(err) {
		tracker.addException({
			description : "DBManager12: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return order;

};

exports.Get_Sale_From_DB_orderHistory = function() {

	Ti.API.info("********************************in get NewOrder orderHistory1****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_sales where order_status IN ("completed","cancelled") ORDER BY id DESC');

		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		//Ti.API.info('Order List DB Data ' + JSON.stringify(order));
	} catch(err) {
		tracker.addException({
			description : "DBManager14: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};

exports.updateOrderReadStatus = function(orderId) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		db.execute('UPDATE ospos_sales SET status=? WHERE id=' + orderId, "0");
	} catch(err) {
		tracker.addException({
			description : "DBManager15: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};
exports.updateRefundTagValue = function(orderId) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		db.execute('UPDATE ospos_sales SET is_refund=?  WHERE id=' + orderId, "1");
		Ti.API.info('UPDATE ospos_sales SET is_refund=?  WHERE id=' + orderId);
	} catch(err) {
		tracker.addException({
			description : "DBManager16: " + err.message,
			fatal : false
		});
		Ti.API.info("In catch = " + err.message);
	} finally {
		db.close();
	}
};
exports.updateSplitRefundTagValue = function(orderId, payMethod) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		if (payMethod == "gift_card") {
			db.execute("UPDATE ospos_split_orders SET is_refund = '1' WHERE sale_id = " + parseInt(orderId) + " AND payment_method = 'gift_card'");
		} else {
			db.execute("UPDATE ospos_split_orders SET is_refund = '1' WHERE sale_id = " + parseInt(orderId) + " AND payment_method = 'credit_card'");
		}
	} catch(err) {
		tracker.addException({
			description : "DBManager16: " + err.message,
			fatal : false
		});
		Ti.API.info("In catch = " + err.message);
	} finally {
		db.close();
	}
};
exports.updateOrderStatusToNew = function(orderId) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		db.execute('UPDATE ospos_sales SET order_status=?  WHERE id=' + orderId, "new");
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager16: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};
exports.updateOrderStatusToPreparing = function(orderId, duration, acceptedDate) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		db.execute('UPDATE ospos_sales SET timer=?,accepted_at=?,order_status=?  WHERE id=' + orderId, duration, acceptedDate, "preparing");
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager16: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};

exports.updateOrderStatusToReady = function(orderId) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		db.execute('UPDATE ospos_sales SET order_status=?  WHERE id=' + orderId, "ready");
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager18: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};

exports.updateOrderStatusCancelled = function(orderId) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		db.execute('UPDATE ospos_sales SET order_status=?  WHERE id=' + orderId, "cancelled");
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager19: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};
exports.updateOrderStatusCompleted = function(orderId) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		db.execute('UPDATE ospos_sales SET order_status=?  WHERE id=' + orderId, "completed");
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager20: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};

exports.getDiscountFromDatabase = function() {
	var discount = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultData = db.execute('SELECT * FROM ospos_discount');

		while (resultData.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultData.fieldByName("id");
			dataobj.title = resultData.fieldByName('title');
			dataobj.category_id = resultData.fieldByName('category_id');
			dataobj.menu_id = resultData.fieldByName('menu_id');
			dataobj.quantity = resultData.fieldByName('quantity');
			dataobj.serving_sizes_id = resultData.fieldByName('serving_sizes_id');
			dataobj.discount_type = resultData.fieldByName("discount_type");
			dataobj.discount_rate = resultData.fieldByName('discount_rate');
			dataobj.start_date = resultData.fieldByName('start_date');
			dataobj.end_date = resultData.fieldByName('end_date');
			dataobj.start_time = resultData.fieldByName('start_time');
			dataobj.end_time = resultData.fieldByName('end_time');
			dataobj.apply_option = resultData.fieldByName('apply_option');
			dataobj.coupon_code = resultData.fieldByName('coupon_code');
			dataobj.combine_discount = resultData.fieldByName('combine_discount');
			dataobj.discount_repeat = resultData.fieldByName('discount_repeat');
			dataobj.discount_start = JSON.parse(resultData.fieldByName('discount_start'));
			dataobj.discount_end = JSON.parse(resultData.fieldByName('discount_end'));
			dataobj.status = resultData.fieldByName('status');
			dataobj.is_deleted = resultData.fieldByName('is_deleted');
			dataobj.created_at = resultData.fieldByName('created_at');
			dataobjupdated_at = resultData.fieldByName('updated_at');
			if (resultData.fieldByName('is_deleted') != 1 && resultData.fieldByName('status') == "Active") {
				discount.push(dataobj);
			}

			resultData.next();
		}

		//Ti.API.info('discount List DB Data ' + JSON.stringify(discount));
	} catch(err) {
		Ti.API.info('discount List DB ERORR ' + err.message);
		tracker.addException({
			description : "DBManager20: " + err.message,
			fatal : false
		});
	} finally {
		resultData.close();
		db.close();
	}

	return discount;
};

exports.insertParkedOrderDetail = function(parkedOrderDetail) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		Ti.API.info(parkedOrderDetail.discount);
		//var parkedData = db.execute('SELECT id FROM ospos_parked_order where id=' + parkedOrderDetail.id);
		//Ti.API.info(parkedData.getRowCount());
		//if (parkedData.getRowCount() == 0) {

		db.execute('INSERT INTO ospos_parked_order(parkedDate,total_amount,detail,customer_name,customer_mobile,customer_email,customer_id,discount,sub_total,tax) VALUES (?,?,?,?,?,?,?,?,?,?)', parkedOrderDetail.parkedDate, parkedOrderDetail.total_amount, parkedOrderDetail.detail, parkedOrderDetail.name, parkedOrderDetail.email, parkedOrderDetail.mobile, parkedOrderDetail.customer_id, parkedOrderDetail.discount, parkedOrderDetail.sub_total, parkedOrderDetail.tax);
		//} else {
		//db.execute('UPDATE ospos_parked_order SET parkedDate=?,total_amount=?,detail=?,customer_name=?,customer_mobile=?, customer_email=?,customer_id=?,discount=?,sub_total=?,tax=?  WHERE id=' + parkedData.fieldByName("id"), parkedOrderDetail.parkedDate, parkedOrderDetail.total_amount, parkedOrderDetail.detail, parkedOrderDetail.customer_name, parkedOrderDetail.customer_mobile, parkedOrderDetail.customer_email, parkedOrderDetail.customer_id, parkedOrderDetail.discount, parkedOrderDetail.sub_total, parkedOrderDetail.tax);
		//}

	} catch(err) {
		Ti.API.info('insertParkedOrderDetail ERROR ' + err.message);
		tracker.addException({
			description : "DBManager21: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};
exports.getParkedOrderDetail = function(id) {
	var parkedOrder = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		if (id == "") {
			resultData = db.execute('SELECT * FROM ospos_parked_order ORDER BY id DESC');
		} else {
			resultData = db.execute('SELECT * FROM ospos_parked_order WHERE id=' + id);
		}

		while (resultData.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultData.fieldByName("id");
			dataobj.parkedDate = resultData.fieldByName('parkedDate');
			dataobj.total_amount = resultData.fieldByName('total_amount');
			dataobj.detail = JSON.parse(resultData.fieldByName('detail'));
			dataobj.customer_name = resultData.fieldByName('customer_name');
			dataobj.customer_mobile = resultData.fieldByName('customer_mobile');
			dataobj.customer_email = resultData.fieldByName("customer_email");
			dataobj.customer_id = resultData.fieldByName('customer_id');
			dataobj.discount = resultData.fieldByName('discount');
			dataobj.sub_total = resultData.fieldByName('sub_total');
			dataobj.tax = resultData.fieldByName('tax');

			parkedOrder.push(dataobj);

			resultData.next();
		}

		//Ti.API.info('parkedOrder List DB Data ' + JSON.stringify(parkedOrder));
	} catch(err) {
		Ti.API.info('getParkedOrderDetail ERROR ' + err.message);
		tracker.addException({
			description : "DBManager22: " + err.message,
			fatal : false
		});
	} finally {
		resultData.close();
		db.close();
	}

	return parkedOrder;

};
exports.deleteParkedOrderDetail = function(id) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		Ti.API.info(id);
		db.execute('DELETE FROM ospos_parked_order WHERE id= ' + id);

	} catch(err) {
		tracker.addException({
			description : "DBManager23: " + err.message,
			fatal : false
		});
		Ti.API.info('insertParkedOrderDetail ERROR ' + err.message);
	} finally {
		db.close();
	}
};
exports.insertTillManagementDetail = function(tillmanagementDetail) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		//Ti.API.info("tillmanagementDetail =" + JSON.stringify(tillmanagementDetail));
		var tillManagementData = db.execute('SELECT * FROM ospos_tillmanagement');
		// if (tillManagementData.getRowCount() == 0) {
		// db.execute('INSERT INTO ospos_tillmanagement(id, employee_id, employee_name,employee_image,date,description,pay_type,amount) VALUES (?,?,?,?,?,?,?,?)', tillmanagementDetail.id, tillmanagementDetail.employee_id, tillmanagementDetail.employee_name, tillmanagementDetail.employee_image, tillmanagementDetail.date, tillmanagementDetail.description, tillmanagementDetail.pay_type, tillmanagementDetail.amount);
		// } else {
		// db.execute('UPDATE ospos_tillmanagement SET employee_id=?,employee_name=?,employee_image=?,date=?,description=?, pay_type=?,amount=?  WHERE id=' + tillmanagementDetail.id, tillmanagementDetail.employee_id, tillmanagementDetail.employee_name, tillmanagementDetail.employee_image, tillmanagementDetail.date, tillmanagementDetail.description, tillmanagementDetail.pay_type, tillmanagementDetail.amount);
		// }
		db.execute('INSERT INTO ospos_tillmanagement(id, employee_id, employee_name,employee_image,date,description,pay_type,amount,pay_for) VALUES (?,?,?,?,?,?,?,?,?)', tillmanagementDetail.id, tillmanagementDetail.employee_id, tillmanagementDetail.employee_name, tillmanagementDetail.employee_image, tillmanagementDetail.date, tillmanagementDetail.description, tillmanagementDetail.pay_type, tillmanagementDetail.amount, tillmanagementDetail.pay_for);
	} catch(err) {
		Ti.API.info('insertTillManagementDetail ERROR ' + err.message);
		tracker.addException({
			description : "DBManager24: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};

exports.getTillManagementDetail = function(date) {
	var tillManagementData = [];

	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');

		if (date == "") {
			resultData = db.execute('SELECT * FROM ospos_tillmanagement ORDER BY id DESC');
		} else {
			resultData = db.execute('SELECT * FROM ospos_tillmanagement WHERE date > ' + date);
		}

		while (resultData.isValidRow()) {
			var dataobj = {};
			dataobj.id = resultData.fieldByName("id");
			dataobj.employee_id = resultData.fieldByName('employee_id');
			dataobj.employee_name = resultData.fieldByName('employee_name');
			dataobj.employee_image = resultData.fieldByName('employee_image');
			dataobj.date = resultData.fieldByName('date');
			dataobj.description = resultData.fieldByName('description');
			dataobj.pay_type = resultData.fieldByName("pay_type");
			dataobj.amount = resultData.fieldByName('amount');
			dataobj.pay_for = resultData.fieldByName('pay_for');
			tillManagementData.push(dataobj);

			resultData.next();
		}

		//Ti.API.info('tillManagementData List DB Data ' + JSON.stringify(tillManagementData));
	} catch(err) {
		Ti.API.info('getTillManagementDetail ERROR ' + err.message);
		tracker.addException({
			description : "DBManager25: " + err.message,
			fatal : false
		});
	} finally {
		resultData.close();
		db.close();
	}

	return tillManagementData;
};

exports.getRegisterDetail = function(updated_date) {
	var registerData = [];

	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');

		if (updated_date == "") {
			resultData = db.execute('SELECT * FROM ospos_register ORDER BY id DESC');
		} else {
			resultData = db.execute('SELECT * FROM ospos_register WHERE updated_date > ' + updated_date);
			//Ti.API.info('updated_date =' + updated_date);
		}
		while (resultData.isValidRow()) {
			var dataobj = {};
			dataobj.id = resultData.fieldByName("id");
			dataobj.opening_time = resultData.fieldByName('opening_time');
			dataobj.opening_note = resultData.fieldByName('opening_note');
			dataobj.previous_day_amount = resultData.fieldByName('previous_day_amount');
			dataobj.cash_expected_amount = resultData.fieldByName('cash_expected_amount');
			dataobj.cash_found = resultData.fieldByName('cash_found');
			dataobj.cash_difference = resultData.fieldByName("cash_difference");
			dataobj.card_expected_amount = resultData.fieldByName('card_expected_amount');
			dataobj.card_found = resultData.fieldByName('card_found');
			dataobj.card_difference = resultData.fieldByName('card_difference');
			dataobj.giftcard_expected_amount = resultData.fieldByName('giftcard_expected_amount');
			dataobj.giftcard_found = resultData.fieldByName('giftcard_found');
			dataobj.giftcard_difference = resultData.fieldByName('giftcard_difference');
			dataobj.closing_note = resultData.fieldByName('closing_note');
			dataobj.closing_time = resultData.fieldByName('closing_time');
			dataobj.status = resultData.fieldByName('status');
			dataobj.updated_date = resultData.fieldByName('updated_date');
			registerData.push(dataobj);
			resultData.next();
		}

		//Ti.API.info('registerData List DB Data ' + JSON.stringify(registerData));
	} catch(err) {
		Ti.API.info('getRegisterDetail ERROR ' + err.message);
		tracker.addException({
			description : "DBManager26: " + err.message,
			fatal : false
		});
	} finally {
		resultData.close();
		db.close();
	}

	return registerData;
};

exports.insertOpenCloseRegisterDetail = function(registerDetail, id) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		//Ti.API.info("registerDetail =" + JSON.stringify(registerDetail));
		var registerData;
		if (id == "") {
			//Ti.API.info('in If');
			registerData = db.execute('SELECT * FROM ospos_register');
		} else {
			//Ti.API.info('in else ' + id);
			registerData = db.execute('SELECT * FROM ospos_register WHERE id=' + id);
		}
		//Ti.API.info("registerData.getRowCount() =" + registerData.getRowCount());

		if (registerData.getRowCount() == 0) {
			//Ti.API.info('in If-1');
			db.execute('INSERT INTO ospos_register(id, opening_time, opening_note,previous_day_amount,cash_expected_amount,cash_found,cash_difference,card_expected_amount,card_found,card_difference,giftcard_expected_amount,giftcard_found,giftcard_difference,closeing_note,closing_time,status,updated_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', registerDetail.id, registerDetail.opening_time, registerDetail.opening_note, registerDetail.previous_day_amount, registerDetail.cash_expected_amount, registerDetail.cash_found, registerDetail.cash_difference, registerDetail.card_expected_amount, registerDetail.card_found, registerDetail.card_difference, registerDetail.giftcard_expected_amount, registerDetail.giftcard_found, registerDetail.giftcard_difference, registerDetail.closing_note, registerDetail.closing_time, registerDetail.status, registerDetail.updated_date);
		} else {
			//Ti.API.info('in else-1');
			//db.execute('UPDATE ospos_register SET opening_time=?,opening_note=?,previous_day_amount=?,cash_expected_amount=?,cash_found=?,cash_difference=?,card_expected_amount=?,card_found=?,card_difference=?,giftcard_expected_amount=?,giftcard_found=?,giftcard_difference=?,closeing_note=?,closing_time=?,status=?,updated_date=? WHERE id=' + registerDetail.id, registerDetail.opening_time, registerDetail.opening_note, registerDetail.previous_day_amount, registerDetail.cash_expected_amount, registerDetail.cash_found, registerDetail.cash_difference, registerDetail.card_expected_amount, registerDetail.card_found, registerDetail.card_difference, registerDetail.giftcard_expected_amount, registerDetail.giftcard_found, registerDetail.giftcard_difference, registerDetail.closeing_note, registerDetail.closing_time, registerDetail.status, registerDetail.updated_date);
			db.execute('UPDATE ospos_register SET previous_day_amount=?,cash_expected_amount=?,cash_found=?,cash_difference=?,closing_note=?,closing_time=?,status=?,updated_date=? WHERE id=' + id, registerDetail.previous_day_amount, registerDetail.cash_expected_amount, registerDetail.cash_found, registerDetail.cash_difference, registerDetail.closing_note, registerDetail.closing_time, registerDetail.status, registerDetail.updated_date);
		}

	} catch(err) {
		Ti.API.info('insertregisterData ERROR ' + err.message);
		tracker.addException({
			description : "DBManager27: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};

exports.getOpenedRegisterDetail = function() {
	var registerData = [];

	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');

		resultData = db.execute('SELECT * FROM ospos_register WHERE status = opened');

		while (resultData.isValidRow()) {
			var dataobj = {};
			dataobj.id = resultData.fieldByName("id");
			dataobj.opening_time = resultData.fieldByName('opening_time');
			dataobj.opening_note = resultData.fieldByName('opening_note');
			dataobj.previous_day_amount = resultData.fieldByName('previous_day_amount');
			dataobj.cash_expected_amount = resultData.fieldByName('cash_expected_amount');
			dataobj.cash_found = resultData.fieldByName('cash_found');
			dataobj.cash_difference = resultData.fieldByName("cash_difference");
			dataobj.card_expected_amount = resultData.fieldByName('card_expected_amount');
			dataobj.card_found = resultData.fieldByName('card_found');
			dataobj.card_difference = resultData.fieldByName('card_difference');
			dataobj.giftcard_expected_amount = resultData.fieldByName('giftcard_expected_amount');
			dataobj.giftcard_found = resultData.fieldByName('giftcard_found');
			dataobj.giftcard_difference = resultData.fieldByName('giftcard_difference');
			dataobj.closing_note = resultData.fieldByName('closing_note');
			dataobj.closing_time = resultData.fieldByName('closing_time');
			dataobj.status = resultData.fieldByName('status');
			dataobj.updated_date = resultData.fieldByName('updated_date');
			registerData.push(dataobj);
			resultData.next();
		}

		//Ti.API.info('registerData List DB Data ' + JSON.stringify(registerData));
	} catch(err) {
		Ti.API.info('getRegisterDetail ERROR ' + err.message);
		tracker.addException({
			description : "DBManager28: " + err.message,
			fatal : false
		});
	} finally {
		resultData.close();
		db.close();
	}

	return registerData;
};

exports.getSumOfTotalSales = function() {

	//Ti.API.info("********************************in New****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		//resultSet = db.execute('SELECT * FROM ospos_sales SUM(Total) where order_status IN ("pending", "new","ready")  AND store_id=' + storeId  +' ORDER BY id DESC');
		resultSet = db.execute('SELECT * FROM ospos_sales where order_status IN ("completed") AND payment_method IN ("cash")');
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.accepted_at = resultSet.fieldByName('accepted_at');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		//Ti.API.info('Order List DB Data ' + JSON.stringify(order));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager29: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};

exports.getSumCardPaymentOfTotalSales = function() {

	//Ti.API.info("********************************in New****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		//resultSet = db.execute('SELECT * FROM ospos_sales SUM(Total) where order_status IN ("pending", "new","ready")  AND store_id=' + storeId  +' ORDER BY id DESC');
		//resultSet = db.execute('SELECT * FROM ospos_sales where order_status IN ("completed") AND payment_method IN ("credit_card")');
		resultSet = db.execute('SELECT * FROM ospos_sales where payment_method IN ("credit_card")');

		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.accepted_at = resultSet.fieldByName('accepted_at');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		Ti.API.info('card payment ' + JSON.stringify(order));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};

// exports.getSumOfTotalSales = function(orderId) {
// var sum=1;
// try {
// db = Titanium.Database.open('GongchaPOS_DB');
// sum = db.execute('SELECT SUM(subtotal) FROM ospos_sales');
// Ti.API.info('sum ='+JSON.stringify(sum));
// } catch(err) {
// Ti.API.info("In catch = " + e.message);
// } finally {
// db.close();
// }
// };

exports.getClosedRegisterDetail = function(id) {
	var registerData = [];

	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');

		resultData = db.execute('SELECT * FROM ospos_register WHERE id=' + id);

		while (resultData.isValidRow()) {
			var dataobj = {};
			dataobj.id = resultData.fieldByName("id");
			dataobj.opening_time = resultData.fieldByName('opening_time');
			dataobj.opening_note = resultData.fieldByName('opening_note');
			dataobj.previous_day_amount = resultData.fieldByName('previous_day_amount');
			dataobj.cash_expected_amount = resultData.fieldByName('cash_expected_amount');
			dataobj.cash_found = resultData.fieldByName('cash_found');
			dataobj.cash_difference = resultData.fieldByName("cash_difference");
			dataobj.card_expected_amount = resultData.fieldByName('card_expected_amount');
			dataobj.card_found = resultData.fieldByName('card_found');
			dataobj.card_difference = resultData.fieldByName('card_difference');
			dataobj.giftcard_expected_amount = resultData.fieldByName('giftcard_expected_amount');
			dataobj.giftcard_found = resultData.fieldByName('giftcard_found');
			dataobj.giftcard_difference = resultData.fieldByName('giftcard_difference');
			dataobj.closing_note = resultData.fieldByName('closing_note');
			dataobj.closing_time = resultData.fieldByName('closing_time');
			dataobj.status = resultData.fieldByName('status');
			dataobj.updated_date = resultData.fieldByName('updated_date');
			registerData.push(dataobj);
			resultData.next();
		}

		Ti.API.info('closeregisterData List DB Data ' + JSON.stringify(registerData));
	} catch(err) {
		Ti.API.info('getClosedRegisterDetail ERROR ' + err.message);
		tracker.addException({
			description : "DBManager30: " + err.message,
			fatal : false
		});
	} finally {
		resultData.close();
		db.close();
	}

	return registerData;
};
exports.insertOpenRegisterDetail = function(registerDetail) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		//Ti.API.info("registerDetail =" + JSON.stringify(registerDetail));
		var registerData = db.execute('SELECT * FROM ospos_register');
		//Ti.API.info("registerData.getRowCount() =" + registerData.getRowCount());
		db.execute('INSERT INTO ospos_register(id, opening_time, opening_note,previous_day_amount,cash_expected_amount,cash_found,cash_difference,card_expected_amount,card_found,card_difference,giftcard_expected_amount,giftcard_found,giftcard_difference,closing_note,closing_time,status,updated_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', registerDetail.id, registerDetail.opening_time, registerDetail.opening_note, registerDetail.previous_day_amount, registerDetail.cash_expected_amount, registerDetail.cash_found, registerDetail.cash_difference, registerDetail.card_expected_amount, registerDetail.card_found, registerDetail.card_difference, registerDetail.giftcard_expected_amount, registerDetail.giftcard_found, registerDetail.giftcard_difference, registerDetail.closing_note, registerDetail.closing_time, registerDetail.status, registerDetail.updated_date);

	} catch(err) {
		Ti.API.info('insertOpenregisterData ERROR ' + err.message);
		tracker.addException({
			description : "DBManager31: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};

exports.insertCloseRegisterDetail = function(registerDetail, id) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		//Ti.API.info("registerDetail =" + JSON.stringify(registerDetail));
		var registerData = db.execute('SELECT * FROM ospos_register WHERE id=' + id);
		//Ti.API.info("registerData.getRowCount() =" + registerData.getRowCount());
		db.execute('UPDATE ospos_register SET previous_day_amount=?,cash_expected_amount=?,cash_found=?,cash_difference=?,closing_note=?,closing_time=?,status=?,updated_date=? WHERE id=' + id, registerDetail.previous_day_amount, registerDetail.cash_expected_amount, registerDetail.cash_found, registerDetail.cash_difference, registerDetail.closing_note, registerDetail.closing_time, registerDetail.status, registerDetail.updated_date);
	} catch(err) {
		Ti.API.info('updateCloseregisterData ERROR ' + err.message);
		tracker.addException({
			description : "DBManager32: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};

exports.insertPrinterDetail = function(peripheral) {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		db.execute('INSERT INTO ospos_printer_tbl(peripheral) VALUES (?)', peripheral);
	} catch(err) {
		Ti.API.info('updateospos_printer_tbl ERROR ' + err.message);
		tracker.addException({
			description : "DBManager33: " + err.message,
			fatal : false
		});
	} finally {
		db.close();
	}
};
exports.getPrinterDetail = function() {
	var printerData = [];

	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');

		resultData = db.execute('SELECT * FROM ospos_printer_tbl');

		while (resultData.isValidRow()) {
			var dataobj = {};
			dataobj.id = resultData.fieldByName("id");
			dataobj.peripheral = resultData.fieldByName('peripheral');

			printerData.push(dataobj);
			resultData.next();
		}

		//Ti.API.info('closeregisterData List DB Data ' + JSON.stringify(printerData));
	} catch(err) {
		Ti.API.info('getClosedRegisterDetail ERROR ' + err.message);
		tracker.addException({
			description : "DBManager34: " + err.message,
			fatal : false
		});
	} finally {
		resultData.close();
		db.close();
	}

	return printerData;

};

exports.deleteAllTableDetails = function() {
	try {
		db = Titanium.Database.open('GongchaPOS_DB');
		db.execute('DELETE FROM ospos_cat');
		db.execute('DELETE FROM ospos_discount');
		db.execute('DELETE FROM ospos_menu_modifier_group');
		db.execute('DELETE FROM ospos_menu_modifier_serving');
		db.execute('DELETE FROM ospos_menu_prefix');
		db.execute('DELETE FROM ospos_menu_serving');
		db.execute('DELETE FROM ospos_menus');
		db.execute('DELETE FROM ospos_modifier');
		db.execute('DELETE FROM ospos_modifier_group');
		db.execute('DELETE FROM ospos_modifier_prefix');
		db.execute('DELETE FROM ospos_parked_order');
		db.execute('DELETE FROM ospos_prefix_serving_modifier_price');
		db.execute('DELETE FROM ospos_printer_tbl');
		db.execute('DELETE FROM ospos_register');
		db.execute('DELETE FROM ospos_sales');
		db.execute('DELETE FROM ospos_sales_items');
		db.execute('DELETE FROM ospos_sales_payments');
		db.execute('DELETE FROM ospos_serving');
		db.execute('DELETE FROM ospos_serving_modifiers_price');
		db.execute('DELETE FROM ospos_tax_codes');
		db.execute('DELETE FROM ospos_tillmanagement');
		db.execute('DELETE FROM ospos_split_orders');
	} catch(err) {
		Ti.API.info('updateospos_printer_tbl ERROR ' + err.message);
	} finally {
		db.close();
	}

};

exports.getSumHousingAmountOfTotalSales = function() {

	Ti.API.info("********************************payment through housing account****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		//resultSet = db.execute('SELECT * FROM ospos_sales SUM(Total) where order_status IN ("pending", "new","ready")  AND store_id=' + storeId  +' ORDER BY id DESC');
		resultSet = db.execute('SELECT * FROM ospos_sales where order_status IN ("completed") AND payment_method IN ("housing_management")');
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.accepted_at = resultSet.fieldByName('accepted_at');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		Ti.API.info('housing payment ' + JSON.stringify(order));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};

exports.getPrinterReceiptConfigurationDetailFromDB = function() {

	Ti.API.info("********************************in get printer detail****************************");

	var printerDetail = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_receipt_template');
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.template_type = resultSet.fieldByName('template_type');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.settings = JSON.parse(resultSet.fieldByName('settings'));
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			printerDetail.push(dataobj);

			resultSet.next();
		}

		Ti.API.info('printer detail DB Data ' + JSON.stringify(printerDetail));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager10: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return printerDetail;
};
exports.getPaymentDetailFromDB = function(sale_id) {

	Ti.API.info("********************************in get payment detail****************************");

	var paymentDetail = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_split_orders');
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.sale_id = resultSet.fieldByName('sale_id');
			dataobj.amount = resultSet.fieldByName('amount');
			dataobj.method = resultSet.fieldByName('method');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.is_deleted = resultSet.fieldByName('is_deleted');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			paymentDetail.push(dataobj);

			resultSet.next();
		}

		Ti.API.info('paymentDetail DB Data ' + JSON.stringify(paymentDetail));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager10: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return paymentDetail;
};

exports.getTotalSales = function() {

	Ti.API.info("********************************totalSale****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_sales');
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.accepted_at = resultSet.fieldByName('accepted_at');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		Ti.API.info('total Sale ' + JSON.stringify(order));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};

exports.Get_Sale_Later_From_DB = function(storeId) {

	Ti.API.info("********************************in get NewOrder orderHistory1****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_sales where order_status IN ("pending") AND pickup_type IN ("later")');
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.accepted_at = resultSet.fieldByName('accepted_at');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		//Ti.API.info('New Order List DB Data ' + JSON.stringify(order));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager10: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};

exports.Get_Sale_Asap_From_DB = function(storeId) {
	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		resultSet = db.execute('SELECT * FROM ospos_sales where order_status IN ("pending", "new","ready","preparing") AND pickup_type IN ("asap")');
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.accepted_at = resultSet.fieldByName('accepted_at');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		//Ti.API.info('New Order List DB Data ' + JSON.stringify(order));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
		tracker.addException({
			description : "DBManager10: " + err.message,
			fatal : false
		});
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};

exports.getSumGiftCardAmountOfTotalSales = function() {

	Ti.API.info("********************************payment through housing account****************************");

	var order = [];
	var resultSet;
	try {

		db = Titanium.Database.open('GongchaPOS_DB');
		//resultSet = db.execute('SELECT * FROM ospos_sales SUM(Total) where order_status IN ("pending", "new","ready")  AND store_id=' + storeId  +' ORDER BY id DESC');
		resultSet = db.execute('SELECT * FROM ospos_sales where order_status IN ("completed") AND payment_method IN ("gift_card")');
		while (resultSet.isValidRow()) {
			var dataobj = {};

			dataobj.id = resultSet.fieldByName('id');
			dataobj.fullname = resultSet.fieldByName('fullname');
			dataobj.profile_pic = resultSet.fieldByName('profile_pic');
			dataobj.pickup_date = resultSet.fieldByName('pickup_date');
			dataobj.customer_id = resultSet.fieldByName('customer_id');
			dataobj.employee_id = resultSet.fieldByName('employee_id');
			dataobj.store_id = resultSet.fieldByName('store_id');
			dataobj.comment = resultSet.fieldByName('comment');
			dataobj.invoice_number = resultSet.fieldByName('invoice_number');
			dataobj.discount_type = resultSet.fieldByName('discount_type');
			dataobj.dis_value = resultSet.fieldByName('dis_value');
			dataobj.subtotal = resultSet.fieldByName('subtotal');
			dataobj.tax = resultSet.fieldByName('tax');
			dataobj.tax_value = resultSet.fieldByName('tax_value');
			dataobj.timer = resultSet.fieldByName('timer');
			dataobj.accepted_at = resultSet.fieldByName('accepted_at');
			dataobj.status = resultSet.fieldByName('status');
			dataobj.accept_time = resultSet.fieldByName('accept_time');
			dataobj.counter_duration = resultSet.fieldByName('counter_duration');
			dataobj.isSchedule = resultSet.fieldByName('isSchedule');
			dataobj.order_type = resultSet.fieldByName('order_type');
			dataobj.order_status = resultSet.fieldByName('order_status');
			dataobj.created_at = resultSet.fieldByName('created_at');
			dataobj.updated_at = resultSet.fieldByName('updated_at');
			dataobj.order_total_price = resultSet.fieldByName('order_total_price');
			dataobj.payment_method = resultSet.fieldByName('payment_method');
			dataobj.discount_total_price = resultSet.fieldByName('discount_total_price');
			dataobj.is_refund = resultSet.fieldByName('is_refund');
			dataobj.loyality_value = resultSet.fieldByName('loyality_value');
			dataobj.loyality_point = resultSet.fieldByName('loyality_point');
			dataobj.pickup_type = resultSet.fieldByName('pickup_type');
			dataobj.trans_num = resultSet.fieldByName('trans_num');
			dataobj.givex_code = resultSet.fieldByName('givex_code');
			dataobj.givex_num = resultSet.fieldByName('givex_num');
			dataobj.order_token = resultSet.fieldByName('order_token');

			order.push(dataobj);

			resultSet.next();
		}

		Ti.API.info('housing payment ' + JSON.stringify(order));
	} catch(err) {
		Ti.API.info("In catch = " + err.message);
	} finally {
		resultSet.close();
		db.close();
	}

	return order;
};