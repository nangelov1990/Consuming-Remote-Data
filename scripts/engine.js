var appUrl = 'https://api.parse.com/1/classes/',
	appHeaders = {
			'X-Parse-Application-Id':'UmrnSGLZyTw2hi0ZLjxcxiDKXZBKA8R3AfQQq7Kn',
			'X-Parse-REST-API-Key':'WHVY0Kvwv4wsrVt37TkDcAwoIpGt18VBfVv1Xdar'
	},
	bookContainer = $('#bookContainer'),
	bookList = $('<ul>'),

	addButton = $('<button>')
		.addClass('addButton')
		.attr('id', 'button')
		.text('Add book'),
	editButton = $('<button>')
		.addClass('editButton')
		.attr('id', 'button')
		.text('Edit book'),
	submitBtn = $('<button>')
		.addClass('submitButton')
		.attr('id', 'button')
		.text('Submit'),

	titleField = $('<input>')
		.attr({
			id: 'titleField',
			type: 'text'
		}),
	authorField = $('<input>')
		.attr({
			id: 'authorField',
			type: 'text'
		}),
	isbnField = $('<input>')
		.attr({
			id: 'isbnField',
			type: 'text'
		}),

	formContainer = $('<div>')
		.attr('id', 'bookForm')
		.append(addButton)
		.appendTo('body'),

	infoFormName = $('<p>')
		.attr('id', 'curBook'),
	infoFormButtons = $('<div>'),
	infoForm = $('<div>')
		.attr('id', 'infoForm')
	titleLabel = $('<label>')
		.attr('for', 'titleField')
		.text('Title'),
	authorLabel = $('<label>')
		.attr('for', 'authorField')
		.text('Author'),	
	isbnLabel = $('<label>')
		.attr('for', 'titleField')
		.text('ISBN');

function createInfoForm () {
	infoForm
		.append(infoFormName)
		.append($('<div>')
			.append(titleLabel)
			.append(titleField))
		.append($('<div>')
			.append(authorLabel)
			.append(authorField))
		.append($('<div>')
			.append(isbnLabel)
			.append(isbnField))
		.append(infoFormButtons)
};

function getBooks () {
	var getBooksUrl = appUrl + 'Books';

	bookContainer.text('Books');
	bookList.html('');

	$.ajax({
		method: 'get',
		headers: appHeaders,
		url: getBooksUrl
	}).success(function (data) {
		var books = data.results,
			bookData;

		console.log(books);

		books.forEach(function (book) {
			bookData = JSON.stringify({
				'title': book.title,
				'author': book.author,
				'isbn': book.isbn,
				'objectId': book.objectId
			});
			sessionStorage[book.objectId] = bookData;

			$('<li>')
				.attr('id', book.objectId)
				.append($('<p>')
					.addClass('bookTitle')
					.text(book.title))
				.append(deleteButton = $('<button>')
					.addClass('deleteButton')
					.attr('id', 'button')
					.text('Delete'))
				.appendTo(bookList);
		});
	}).error(function(err) {
		throw new Error(err.statusText);
	});

	bookContainer.append(bookList);
};

function bookSelected (bookId) {
	var bookObj = JSON.parse(sessionStorage[bookId]);
	sessionStorage['currentBook'] = bookId;

	createInfoForm();

	titleField
		.val(bookObj.title)
		.attr('disabled', 'disabled');
	authorField
		.val(bookObj.author)
		.attr('disabled', 'disabled');
	isbnField
		.val(bookObj.isbn)
		.attr('disabled', 'disabled');
	infoFormName.text('View book');
	infoFormButtons
		.html('')
		.append(editButton);

	formContainer
		.append(infoForm);
};

function addBookForm () {
	createInfoForm();

	titleField
		.removeAttr('disabled')
		.val('')
		.attr('placeholder', 'Book title');
	authorField
		.removeAttr('disabled')
		.val('')
		.attr('placeholder', 'Book author');
	isbnField
		.removeAttr('disabled')
		.val('')
		.attr('placeholder', 'Book isbn - optional');
	infoFormName.text('Add new book');
	infoFormButtons
		.html('')
		.append(submitBtn);

	formContainer
		.append(infoForm);
};

function postBook () {
	var postBooksUrl = appUrl + 'Books',
		postNewBook = confirm('Do you want to add "' + titleField.val() + '"?'),
		bookData = {
			title: titleField.val(),
			author: authorField.val(),
			isbn: isbnField.val(),
		},
		noEmptyFields = false;

	(function emptyFieldsCheck () {
		var field = null;

		(bookData.title === '') ? field = 'Title' :  undefined;
		(bookData.author === '') ? field = 'Author' :  undefined;
		(bookData.title === '' & bookData.author === '') ? field = 'Title and author' :  undefined;

		(field !== null) ? alert(field + ' is empty. Please try again.') : noEmptyFields = true;
	}());

	if (postNewBook & noEmptyFields) {
		$('#infoForm').remove();

		$.ajax({
			method: 'post',
			headers: appHeaders,
			data: JSON.stringify(bookData),
			url: postBooksUrl
		})
		.success(getBooks())
		.error(function(err) {
			throw new Error(err.statusText);
		});
	};
};

function deleteBook (bookId) {
	var confirmDelete = confirm('Are you sure you want to delete "' + JSON.parse(sessionStorage[bookId]).title + '"?');
		domElId = '#' + bookId,
		delBooksUrl = appUrl + 'Books/' + bookId;

	if (confirmDelete) {
		$(domElId).remove();
		infoForm.html('');
		delete sessionStorage[bookId];

		$.ajax({
			method: 'delete',
			headers: appHeaders,
			url: delBooksUrl
		}).success(function () {
			alert('Book successfully deleted.');
		}).error(function(err) {
			throw new Error(err.statusText);
		});
	};
};

function editBookForm (bookId) {
	var bookData = {};

	(function editModeForm (argument) {
		titleField
		.removeAttr('disabled')
		.attr('placeholder', 'Book title');
	authorField
		.removeAttr('disabled')
		.attr('placeholder', 'Book author');
	isbnField
		.removeAttr('disabled')
		.attr('placeholder', 'Book isbn');
	infoFormName.text('Edit book');
	infoFormButtons
		.html('')
		.append(submitBtn);

	formContainer
		.append(infoForm);
	}());
};

function editBook () {
	var currentBookId = sessionStorage['currentBook'],
		currentBook = JSON.parse(sessionStorage[currentBookId]),
		editBooksUrl = appUrl + 'Books/' + currentBookId,
		editBook = confirm('Do you want to edit "' + currentBook.title + '"?'),
		bookCurEdit = {
			title: titleField.val(),
			author: authorField.val(),
			isbn: isbnField.val(),
		},
		editData = {},
		DifferentFields = false,
		titleChanged = false;

	(function difFieldsCheck () {
		(bookCurEdit.title !== currentBook.title) ?
			(function () {
				DifferentFields = true;
				editData.title = bookCurEdit.title;
				currentBook.title = bookCurEdit.title;
				titleChanged = true;
			}()) :
			undefined;
		(bookCurEdit.author !== currentBook.author) ?
			(function () {
				DifferentFields = true;
				editData.author = bookCurEdit.author;
				currentBook.author = bookCurEdit.author;
			}()) :
			undefined;
		(bookCurEdit.isbn !== currentBook.isbn) ?
			(function () {
				DifferentFields = true;
				editData.isbn = bookCurEdit.isbn;
				currentBook.isbn = bookCurEdit.isbn;
			}()) :
			undefined;
	}());

	if (editBook & DifferentFields) {
		sessionStorage[currentBookId] = JSON.stringify(currentBook);

		$.ajax({
			method: 'put',
			headers: appHeaders,
			data: JSON.stringify(editData),
			url: editBooksUrl
		})
		.success(function () {
			(titleChanged) ?
				(function () {
					var curBookId = '#' + sessionStorage['currentBook'];
				 	$($(curBookId).children()[0]).text(editData.title);
				 }()) :
				undefined;
			bookSelected(sessionStorage['currentBook']);
		})
		.error(function(err) {
			throw new Error(err.statusText);
		});
	};
}