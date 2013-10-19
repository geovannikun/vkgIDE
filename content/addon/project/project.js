function Project(){
    this.name;
    this.path;
    this.type;
    this.getFolders = function(){
        var folders = [];
        var path = this.path;
        var list = fs.readdirSync(path);
        list.forEach(function(file) {
            file = path + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) folders.push(file);
        });
        return folders;
    }
    this.getFiles = function(){
        var files = [];
        var path = this.path;
        var list = fs.readdirSync(path);
        list.forEach(function(file) {
            file2 = path + '/' + file;
            var stat = fs.statSync(file2);
            var f = new File(file, file2, mime.lookup(file2));
            if (stat && !stat.isDirectory()) files.push(f);
        });
        return files;
    }
}

function File(name,path,mimetype){
    this.name = name;
    this.path = path;
    this.mimetype = mimetype;
    this.save = function(content){
        var path = this.path;
        fs.writeFile(path, content, function(err) {
            if(err) {
                return false;
            } else {
                return true;
            }
        }); 
    };
    this.load = function(){
        var path = this.path;
        fs.readFileSync(path);
    };
}