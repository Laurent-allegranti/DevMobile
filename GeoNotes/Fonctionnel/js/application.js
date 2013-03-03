var NotesApp = (function(){

	var App = {
		stores: {},
		views: {},
		collections: {}
	}

	//Initialize localStorage Data Store
	App.stores.notes = new Store('notes');

	//Note Model
	var Note = Backbone.Model.extend({
		//Use localStorage datastore
		localStorage: App.stores.notes,

		initialize: function(){
			if (!this.get('title')) {
				this.set({title: "Note @ " + Date()})
			};

			if (!this.get('body')) {
				this.set({body: "No Content"})
			};
		}

	});


	// Notes Collection
	var NoteList = Backbone.Collection.extend({
	// This collection is composed of Note objects
	model: Note,

	// Set the localStorage datastore
	localStorage: App.stores.notes,

	initialize: function(){
		var collection = this;

		// When localStorage updates, fetch data from the store
		this.localStorage.bind('update', function(){
			collection.fetch();
		})
	}

	});

	//Note new form View
	var NewNoteForm = Backbone.View.extend({
		events: {
			"submit form" : "createNote"
		},

		createNote: function(event) {
			var attrs = this.getAttributes();

			var note = new Note();

			note.set(attrs);
			note.save();

			//Stop the browser default behavior
			event.preventDefault();

			//Stop jQuery Mobile from doing it's magic
			event.stopPropagation();

			// Close the dialog box
			$('.ui-dialog').dialog('close');

			this.reset();



		},

		getAttributes: function(){
			return {
				title: this.$('form [name="title"]').val(),
				body: this.$('form [name="body"]').val()
			}
		},

		reset: function() {
			this.$('input, textarea').val('');
		}

	});


	// Represents a listview page displaying a collection of Notes
	// Each item is represented by a NoteListItemView
	var NoteListView = Backbone.View.extend({

		initialize: function(){
			_.bindAll(this, 'addOne', 'addAll');

			this.collection.bind('add', this.addOne);
			this.collection.bind('refresh', this.addAll);

			this.collection.fetch(); //make sure the collection is up to date
		},

		addOne: function(note){
			var view = new NoteListItemView({model: note});
			$(this.el).append(view.render().el);
		},

		addAll: function(){
			$(this.el).empty();
			this.collection.each(this.addOne);
		}

	});


	// Note item view
	var NoteListItemView = Backbone.View.extend({

		tagName: 'li',
		template: _.template($('#note-list-item-template').html()),

		initialize: function(){
		_.bindAll(this, 'render')

		this.model.bind('change', this.render)
		},

		render: function(){
			$(this.el).html(this.template({ note: this.model }))
			return this;
		}

	});

	App.views.newForm = new NewNoteForm({
		el: $('#new')
	});

	App.collections.all_notes = new NoteList();

	App.views.list_alphabetical = new NoteListView({
		el: $('#all_notes'),
		collection: App.collections.all_notes
	});

	window.Note = Note;

	return App;

})();