'use strict';
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://lls:lls2017@localhost:27017/dblls?authSource=admin';
var con_obj =  'tgoods';

var insertDocuments = function(db, callback) {
  // Get the documents collection
//console.log('******************')
//console.log(db);
  var collection = db.collection(con_obj);
//console.log('----------------');  
//console.log(db.collection('documents'));
//console.log('----------------');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection(con_obj);
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });
}

var deleteDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection(con_obj);
  // Insert some documents
  collection.deleteOne({ a : 3 }, function(err, result) {
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
}

/* set设置或新增字段
 db.users.update({"name":"yoona"}, {$set:{school:"Massachusetts Institute of Technology"}});
*/

/* inc 自增
 db.users.update({"name":"yoona"}, {$inc:{age:2}});
*/

/* unset 删除字段
db.users.update({"name":"yoona"}, {$unset:{school:"Massachusetts Institute of Technology"}});
*/

/* rename 字段改名
 db.users.update({"name":"yoona"}, {$rename: {name:"userName", age:"userAge"}});
*/

/*$setOnInsert 更新时，是新记录插入时的默认值
db.products.update({_d:1}, {$set : {item : "apple"}, $setOnInsert : {defaultQty : 100}} , {upsert : true});
*/

/* 当前时间
db.student.update({_id:1}, {$currentDate: {birthday: {$type: "date"}}});
*/

/*用于给数组字段加项，也可加新值
加单个
db.student.update({_id:1}, {$push : {scores: 91}});

加多个
db.student.update(
   { _id: 1 },
   { $push: { scores: { $each: [ 90, 92, 85 ] } } }
)

用slice限制数目，正数取前
db.student.update(
   { _id: 1 },
   { $push: { scores: { $each: [ 70, 78, 90], $slice: 2 } } }
)
用slice限制数目，负数取后，形成队列，消息可用
db.student.update(
   { _id: 1 },
   { $push: { scores: { $each: [ 89, 56 ], $slice: -3 } } }
)
*/

/*
excel存入mongodb
-----
public void readExcel() throws IOException, BiffException {
    // 读取xls文件
    InputStream ins = new FileInputStream("D:/lesiea/文档/course.xls");
    // 设置读文件编码
    WorkbookSettings setEncode = new WorkbookSettings();
    setEncode.setEncoding("UTF-8");
    Workbook rwb = Workbook.getWorkbook(ins, setEncode);
    Sheet sheet = rwb.getSheet(0);
    int cols = sheet.getColumns(); // 列
    int rows = sheet.getRows(); // 行
    for(int i = 0;i<rows;i++){
        Document document = new Document();
        document.put("_id",UUID.randomUUID().toString().replace("-",""));
        for (int c = 0; c < cols; c++) {
            Cell excelRows = sheet.getCell(c, 0);
            Cell excel = sheet.getCell(c, i+1);
            String strRow = excelRows.getContents();
            String str = excel.getContents();
            document.put(strRow,str);
        }
        baseDao.geCollection("course").insertOne(document);
    }
    ins.close();
}
*/


/*
$gt -------- greater than  >

$gte --------- gt equal  >=

$lt -------- less than  <

$lte --------- lt equal  <=

$ne ----------- not equal  !=

$eq  --------  equal  =

模糊查询用的正则生成 like
var pattern = new RegExp("^.*"+str+".*$")

并且 <200 and > 100
 {$lt :200, $gt : 100}


b.test.sort({"amount":1}).skip(100000).limit(10)  //183ms
db.test.find({amount:{$gt:2399927}}).sort({"amount":1}).limit(10)  //53ms
 
*/

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection(con_obj);
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

MongoClient.connect(DB_CONN_STR, function(err, db) {
  if(db==null)return console.log('connect error!');
  console.log("Connected correctly to server");
  //console.log(db);
  insertDocuments(db,function(){});
  findDocuments(db,function(){});
  db.close();
});
