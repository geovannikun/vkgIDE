function Project(name,path,type,ide){
    this.name = name;
    this.path = path;
    this.type = type;
    this.folders = [];
    this.files = [];
    this.ide = ide;
    var list = fs.readdirSync(this.path);
    var path = this.path;
    var folders = [];
    var files = [];
    list.forEach(function(file) {
        var file = path + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()){
            folders.push(new Folder(file,this));
        }else{
            files.push(new File(file,this));
        }
    }.bind(this));
    this.toString = function(){
        return this.name;
    }
    this.files = files;
    this.folders = folders;
    this.showArchives = function(dom){
        dom.innerHTML = "";
        this.folders.forEach(function(f){
            dom.appendChild(f.getHTML());
        });
        this.files.forEach(function(f){
            dom.appendChild(f.getHTML());
        });
    }
}

function File(path,project){
    this.path = path;
    this.mimetype = mime.lookup(this.path);
    this.name = this.path.slice(this.path.lastIndexOf('/')+1, this.path.length);
    this.document;
    this.project = project;
    this.save = function(){
        fs.writeFile(this.path, editor.getValue(), function(err) {
            return !err;
        });
    };
    this.load = function(){
        var ide = this.project.ide;
        ide.fileOpen = this;
        ide.filesOpened.push(this);
        if(!this.document){
            this.document = CodeMirror.Doc(fs.readFileSync(this.path, "utf8"), this.mimetype);
        }
        ide.editor.swapDoc(this.document);
        ide.editor.setOption("mode", this.mimetype);
        ide.changeTitle(this.name);
        ide.editor.refresh();
        ide.editor.focus();
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
        label.onclick = this.load.bind(this);
        label.htmlFor = "fl-"+this.name;
        label.innerHTML = this.name;
        list.appendChild(label);
        list.appendChild(input);
        return list;
    }
}

function Folder(path,project){
    this.name = path.slice(path.lastIndexOf('/')+1, path.length);
    this.path = path;
    this.folders = [];
    this.files = [];
    this.project = project;
    var list = fs.readdirSync(this.path);
    list.forEach(function(file) {
        var file = this.path + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()){
            this.folders.push(new Folder(file, this.project));
        }else{
            this.files.push(new File(file, this.project));
        }
    }.bind(this));
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
