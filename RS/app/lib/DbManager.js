/**
 *  Installation of Database
 */

var db = Ti.Database.install('./RoadSafety_DB.sqlite', 'RoadSafety_DB');
Alloy.Globals.db = db;

/*
 *
 */

exports.update_db = function(response) {

	try {
		db = Ti.Database.open('RoadSafety_DB.sqlite');

		for (var i = 0; i < response.length; i++) {
			if (response[i].section_name == "Category") {
				Ti.API.info('Category');
				db.execute('CREATE TABLE IF NOT EXISTS Category(data varchar);');
				var item = "" + JSON.stringify(response[i].List);
				db.execute('REPLACE INTO Category (data) VALUES (?)', item);
			} else if (response[i].section_name == "Rule") {
				Ti.API.info('Rule');
				db.execute('CREATE TABLE IF NOT EXISTS SafetyRule(data varchar);');
				var item = "" + JSON.stringify(response.List);
				db.execute('REPLACE INTO SafetyRule (data) VALUES (?)', item);
			}
		};

	} catch(dberror) {
		Ti.API.info("Database Error during insert data ");
	} finally {
		db.close();
	}
};

exports.getCategory = function() {
	try {
		db = Ti.Database.open('RoadSafety_DB.sqlite');
		var resultSet = db.execute('SELECT * FROM Category');
		Ti.API.info("resultSet : " + resultSet);
		if (resultSet.isValidRow()) {
			var datarow = rows.fieldByName('data');
			var response = JSON.parse(datarow);
			Ti.API.info("Response : " + JSON.stringify(response));
			return response;
		} else {
			var a = null;
			return null;
		}
	} catch(dberror) {

	} finally {
		db.close();
	}
};

	//
	// /*
	// *  Methods for Fetching and Inserting data
	// */
	//
	// exports.saveMoment = function(momentData) {
	// Ti.API.info("Adding Data..... " + JSON.stringify(momentData));
	// try {
	// db = Ti.Database.open('momentList');
	// db.execute('INSERT INTO momentTable(moment_title,moment_date,moment_description) VALUES (?,?,?)', momentData.title, momentData.date, momentData.description);
	// var momentID = db.execute('SELECT moment_id FROM momentTable WHERE moment_id = (SELECT MAX(moment_id) FROM momentTable)');
	// Ti.API.info("momentID : " + momentID.fieldByName("moment_id"));
	// momentID = momentID.fieldByName("moment_id");
	//
	// var pictureData = momentData.pictureData;
	// var i = 0;
	// for ( i = 0; i < pictureData.length; i++) {
	// db.execute('INSERT INTO pictureTable(moment_id,pic_title,pic_thumb,pic_image,pic_description) VALUES (?,?,?,?,?)', parseInt(momentID), pictureData[i].title, pictureData[i].thumb, pictureData[i].image, pictureData[i].description);
	// Ti.API.info("Picture saved....." + i);
	// }
	//
	// var videoData = momentData.videosection;
	// for ( i = 0; i < videoData.length; i++) {
	// db.execute('INSERT INTO videoTable(moment_id,video_title,video_thumb,video_file,video_description) VALUES (?,?,?,?,?)', parseInt(momentID), videoData[i].title, videoData[i].thumb, videoData[i].track, videoData[i].description);
	// Ti.API.info("Video saved....." + i);
	// }
	//
	// var audioData = momentData.audiosection;
	// for ( i = 0; i < audioData.length; i++) {
	// db.execute('INSERT INTO audioTable(moment_id,audio_title,audio_file,audio_description) VALUES (?,?,?,?)', parseInt(momentID), audioData[i].title, audioData[i].track, audioData[i].description);
	// Ti.API.info("Audio saved....." + i);
	// }
	//
	// var audioSet = db.execute('SELECT * FROM audioTable WHERE moment_id = ?', parseInt(momentID));
	// Ti.API.info("audioSet : " + audioSet);
	// var audioData = [];
	// while (audioSet.isValidRow()) {
	// var audioJsonData = {};
	// audioJsonData.momentId = audioSet.fieldByName("moment_id");
	// Ti.API.info("audioJsonData.momentId : " + audioJsonData.momentId);
	// audioJsonData.title = audioSet.fieldByName("audio_title");
	// Ti.API.info("audioJsonData.title : " + audioJsonData.title);
	// audioJsonData.track = audioSet.fieldByName("audio_file");
	// Ti.API.info("audioJsonData.track : " + audioJsonData.track);
	// audioJsonData.description = audioSet.fieldByName("audio_description");
	// Ti.API.info("audioJsonData.description : " + audioJsonData.description);
	// audioJsonData.audioId = audioSet.fieldByName("audio_id");
	// Ti.API.info("audioJsonData.audioId : " + audioJsonData.audioId);
	// audioData.push(audioJsonData);
	//
	// audioSet.next();
	// }
	// Ti.API.info("audioData : " + JSON.stringify(audioData));
	//
	// } catch(dberror) {
	//
	// } finally {
	// db.close();
	// }
	// };
	//
	// exports.updateMoments = function(momentData) {
	// var i = 0;
	// try {
	// db = Ti.Database.open('momentList');
	// Ti.API.info("updateMoment in Db......" + momentData.momentID);
	//
	// db.execute('UPDATE momentTable SET moment_title=?,moment_description=? WHERE moment_id=?', momentData.title, momentData.description, parseInt(momentData.momentID));
	// var pictureData = momentData.pictureData;
	// for ( i = 0; i < pictureData.length; i++) {
	// if (pictureData[i].action == 'Add') {
	// db.execute('INSERT INTO pictureTable(moment_id,pic_title,pic_thumb,pic_image,pic_description) VALUES (?,?,?,?,?)', parseInt(momentData.momentID), pictureData[i].title, pictureData[i].thumb, pictureData[i].image, pictureData[i].description);
	// } else if (pictureData[i].action == 'Delete') {
	// db.execute('DELETE from pictureTable where pic_id=?', parseInt(pictureData[i].picId));
	// }
	// }
	//
	// var videoData = momentData.videoData;
	// Ti.API.info("videoData Delete : " + JSON.stringify(videoData));
	// for ( i = 0; i < videoData.length; i++) {
	// if (videoData[i].action == 'Add') {
	// db.execute('INSERT INTO videoTable(moment_id,video_title,video_thumb,video_file,video_description) VALUES (?,?,?,?,?)', parseInt(momentData.momentID), videoData[i].title, videoData[i].thumb, videoData[i].track, videoData[i].description);
	// } else if (videoData[i].action == 'Delete') {
	// Ti.API.info("videoID.... : " + parseInt(videoData[i].videoId));
	// db.execute('DELETE from videoTable where video_id=?', parseInt(videoData[i].videoId));
	// }
	// }
	//
	// var audioData = momentData.audioData;
	// Ti.API.info("audioData Delete : " + JSON.stringify(audioData));
	// for ( i = 0; i < audioData.length; i++) {
	// if (audioData[i].action == 'Add') {
	// db.execute('INSERT INTO audioTable(moment_id,audio_title,audio_file,audio_description) VALUES (?,?,?,?)', parseInt(momentData.momentID), audioData[i].title, audioData[i].track, audioData[i].description);
	// } else if (audioData[i].action == 'Delete') {
	// Ti.API.info("audioID.... : " + parseInt(audioData[i].audioId));
	// db.execute('DELETE from audioTable where audio_id=?', parseInt(audioData[i].audioId));
	// }
	// }
	//
	// /*
	// var pictureSet = db.execute('SELECT * FROM videoTable WHERE moment_id =? ', parseInt(momentData.momentID));
	// Ti.API.info("pictureSet : " + pictureSet);
	// var pictureData = [];
	// while (pictureSet.isValidRow()) {
	// var picData = {};
	// picData.momentId = pictureSet.fieldByName("moment_id");
	// picData.title = pictureSet.fieldByName("video_title");
	// picData.thumb = pictureSet.fieldByName("video_thumb");
	// picData.track = pictureSet.fieldByName("video_file");
	// picData.description = pictureSet.fieldByName("video_description");
	// picData.picId = pictureSet.fieldByName("video_id");
	// pictureData.push(picData);
	// pictureSet.next();
	// }
	// Ti.API.info("pictureData : " + JSON.stringify(pictureData));*/
	//
	// // return momentAry;
	//
	// } catch(dberror) {
	// Ti.API.info("dberror : " + dberror);
	// } finally {
	// db.close();
	// }
	// };
	//
	// exports.deleteMoment = function(momentId) {
	// try {
	// db = Ti.Database.open('momentList');
	// db.execute('DELETE from momentTable where moment_id=?', momentId);
	// db.execute('DELETE from audioTable where moment_id=?', momentId);
	// db.execute('DELETE from pictureTable where moment_id=?', momentId);
	// db.execute('DELETE from videoTable where moment_id=?', momentId);
	//
	// } catch(dberror) {
	//
	// } finally {
	// db.close();
	// }
	// };
	//
	// exports.rateMoment = function(momentId, ratingValue) {
	// try {
	// db = Ti.Database.open('momentList');
	// Ti.API.info("Updating Rating in " + momentId + " to " + ratingValue);
	// db.execute('UPDATE momentTable SET moment_rating=? WHERE moment_id=?', parseInt(ratingValue), parseInt(momentId));
	//
	// } catch(dberror) {
	//
	// } finally {
	// db.close();
	// }
	// };
	//
	// exports.fetchRating = function(momentId) {
	// Ti.API.info("fetch Rating : " + momentId);
	// try {
	// db = Ti.Database.open('momentList');
	// var resultSet = db.execute('SELECT moment_rating FROM momentTable WHERE moment_id = ?', parseInt(momentId));
	// Ti.API.info("resultSet : " + resultSet);
	// var momentAry = [];
	// while (resultSet.isValidRow()) {
	// var jsonData = {};
	// jsonData.rating = resultSet.fieldByName("moment_rating");
	// momentAry.push(jsonData);
	// resultSet.next();
	// }
	// Ti.API.info("momentAry : " + JSON.stringify(momentAry));
	// return momentAry[0].rating;
	//
	// } catch(dberror) {
	//
	// } finally {
	//
	// }
	// };

