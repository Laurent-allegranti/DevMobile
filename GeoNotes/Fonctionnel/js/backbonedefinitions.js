	var Note = Backbone.Model.extend({
		defaults : {
			name : "",
			body : "",
		},
        initialize: function(){
        }
    });

	var collecNotes = Backbone.Collection.extend({
		model : Note
	});
	
	var Path = Backbone.Model.extend({
		defaults : {
			name : "",
			body : "",
			id : 0,
			notes: new collecNotes()
		},
        initialize: function(){
        }
    });
	
	window.collecPaths = Backbone.Collection.extend({
		//localStorage: new Backbone.LocalStorage("collecPathsSaving"),
		model : Path
	});
	
	var CollecToSelect = Backbone.View.extend({
		
	  initialize: function() {
		_(this).bindAll('add', 'remove');
		this._options = [];
		this.collection.each(this.add);	
		this.collection.bind('add', this.add);
//                this.collection.bind('change', this.render);
		this.numbered = false;		
	  },
	  add : function(note) {
	  	//note.bind("change", this.render);
		/*var option=document.createElement("option");
		option.text=this.collection.indexOf(note)+1+" - "+note.get("name");
		this._options.push(option);*/
		
	  },
	  render: function() {
		$(this.el).empty();
		var a = this.el;
                while(this._options.length < this.collection.length){
                    var option=document.createElement("option");
                    this._options.push(option);
                }
		for (var i=0; i< this.collection.length; i++) {
                   this._options[i].text = i+1+" - "+this.collection.at(i).get("name");
                   a.add(this._options[i], null);
		}
		
	  }
	});
        
        

	var CollecToList = Backbone.View.extend({
		
	  initialize: function() {
		_(this).bindAll('add', 'remove');
		this._options = [];
		this.collection.each(this.add);	
		this.collection.bind('add', this.add);

	  },
	  add : function(note) {
	  
		this._options.push(note.get("name"));
		
	  },
	  render: function() {
		$(this.el).empty();
		var a = this.el;
		_(this._options).each(function(dv) {
			a.innerHTML+= "<li>"+dv+"</li>";
		});
		
	  }
	});

function saveCollectionToLocal(k, c){
	localStorage[k] = JSON.stringify(c);
}

function getPathsFromJSONString(string){
    var collec = new collecPaths(JSON.parse(string));
    
    for (var i=0; i< collec.length; i++) {
        collec.at(i).set("notes", new collecNotes(collec.at(i).get("notes")));
    }
    return collec;
}

function loadPaths(key){
    if(!localStorage[key]) return new collecPaths();
    //alert("loaded JSON "+localStorage[key]);
    return getPathsFromJSONString(localStorage[key]);
}


function loadPathFromServeur(callback, localKey){

    var result = $.ajax({
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            url: 'http://localhost:8080/NetbeansProject/webresources/aministratorSave', //'http://localhost:8080/WebServiceInvocation/webresources/generic/',//'webresources/generic',
            type: 'GET',
            mimeType: 'text/JSON',
            success: function(data) { 
                var c = getPathsFromJSONString(data);
                saveCollectionToLocal(localKey, c);
                alert(localKey);
                //alert(data);
            }
            
        }).done(callback);
        result.fail(function(jqXHR, textStatus) {
            alert( "Request failed: " + textStatus );
        });
}
