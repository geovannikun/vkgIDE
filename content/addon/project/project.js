function Project(name,path,type){
    this.name = name;
    this.path = path;
    this.type = type;
    this.folders = [];
    this.files = [];
    var list = fs.readdirSync(this.path);
    var path = this.path;
    var folders = [];
    var files = [];
    list.forEach(function(file) {
        var file = path + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()){
            folders.push(new Folder(file));
        }else{
            files.push(new File(file));
        }
    });
    this.files = files;
    this.folders = folders;
    this.open = function(dom){
        dom.innerHTML = "";
        this.folders.forEach(function(f){
            dom.appendChild(f.getHTML());
        });
        this.files.forEach(function(f){
            dom.appendChild(f.getHTML());
        });
    }
}

function File(path){
    this.path = path;
    this.mimetype = mime.lookup(this.path);
    this.name = this.path.slice(this.path.lastIndexOf('/')+1, this.path.length);
    var self = this;
    this.save = function(){
        fs.writeFile(this.path, editor.getValue(), function(err) {
            return !err;
        });
    };
    this.load = function(){
        fileOpened = self;
        if(!self.document){
            self.document = CodeMirror.Doc(fs.readFileSync(self.path, "utf8"), self.mimetype);
        }
        editor.swapDoc(self.document);
        editor.setOption("mode", self.mimetype);
        document.title = self.name + " - vkgIDE"
        editor.refresh();
        editor.focus();
    };
    this.toString = function(){
        return this.name;
    }
    this.getHTML = function(){
        var list = document.createElement("li");
        var input = document.createElement("input");
        input.type = "radio";
        input.id = "fl-"+this.name;
        var label = document.createElement("label");
        label.onclick = this.load;
        label.htmlFor = "fl-"+this.name;
        label.innerHTML = this.name;
        list.appendChild(label);
        list.appendChild(input);
        return list;
    }
}

function Folder(path){
    this.name = path.slice(path.lastIndexOf('/')+1, path.length);
    this.path = path;
    this.folders = [];
    this.files = [];
    var list = fs.readdirSync(this.path);
    var self = this;
    list.forEach(function(file) {
        var file = self.path + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()){
            self.folders.push(new Folder(file));
        }else{
            self.files.push(new File(file));
        }
    });
    this.toString = function(){
        return this.name;
    }
    this.getHTML = function(){
        var list = document.createElement("li");
        var input = document.createElement("input");
        input.type = "checkbox";
        input.id = "fld-"+this.path+this.name;
        var label = document.createElement("label");
        label.htmlFor = "fld-"+this.path+this.name;
        label.innerHTML = this.name;
        var filet = document.createElement("li");
        this.files.forEach(function(file){
            filet.appendChild(file.getHTML());
        });
        this.folders.forEach(function(folder){
            filet.appendChild(folder.getHTML());
        });
        list.appendChild(label);
        list.appendChild(input);
        list.appendChild(filet);
        return list;
    }
}
