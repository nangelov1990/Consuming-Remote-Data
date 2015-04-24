$(function () {
	getBooks();

	$('#bookContainer').on('mouseover', '.bookTitle', function(ev) {
		$(ev.target.parentElement).css({
			background: 'red'
		});
	});

	$('#bookContainer').on('mouseleave', '.bookTitle', function(ev) {
		$(ev.target.parentElement).css({
			background: 'none'
		});
	});

	$('#bookContainer').on('click', '.bookTitle', function(ev) {
		var bookId = ev.target.parentElement.id;
		bookSelected(bookId);
	});

	$('body').on('click', '#button', function(ev) {
		var button = ev.target;

		switch(button.className) {
			case 'addButton':
				addBookForm();
				break;
			case 'editButton': {
				var bookId = sessionStorage['currentBook'];
				console.log(sessionStorage[bookId]);
				editBookForm(bookId);
				break;
			}
			case 'deleteButton': {
				var bookId = ev.target.parentElement.id;
				deleteBook(bookId);
				break;
			}
			case 'submitButton':
				(infoFormName.text() === 'Edit book') ? editBook() : postBook();
				break;
			default:
				break;
		}
	});
});