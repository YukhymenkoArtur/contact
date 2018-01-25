'use strict';


window.$ = window.jQuery = require('jquery');
require('bootstrap');


require('./../css/style.css');


function Contact(name, email, number) {
    this.name = name;
    this.email = email;
    this.number = number;
    this.id = $.now();
}


$(document).ready(main);



function main() {

    refreshContactsView();


    $('.table').on('click', '#add-contact-btn', addContactBtnCb);


    $('.table').on('click', '.delete-contact-btn', deleteBtnCb);




    function addContactBtnCb() {
        var newContact = {};
        var ajaxSettings = {};


        if ($.trim($('#new-name').val()) === '' ||
            $.trim($('#new-email').val()) === '' ||
            $.trim($('#new-number').val()) === '') {
            
            $(this)
                .popover({
                    content: 'Fields can not be empty.',
                    placement: 'top'
                })
                .popover('show');
            
            return false;
        } else {
            $(this).popover('destroy');
        }
        
        newContact = new Contact(
            $('input#new-name').val(),
            $('input#new-email').val(),
            $('input#new-number').val()
        );

        ajaxSettings = {
            type: 'PUT',
            data: JSON.stringify(newContact),
            contentType: 'application/json',
            url: 'http://localhost:3000/add-contact',
            success: ajaxPutSuccessCb,
            error: ajaxPutErrorCb
        };

        $.ajax(ajaxSettings);



        function ajaxPutSuccessCb(res) {
            console.log(res);
            refreshContactsView();
        }

        function ajaxPutErrorCb(err) {
            console.error(err);
        }
    }


    function deleteBtnCb() {
        var id = $(this).attr('id');
        var ajaxSettings = {};

        ajaxSettings = {
            type: 'DELETE',
            url: '/delete/' + id,
            success: ajaxDeleteSuccessCb,
            error: ajaxDeleteErrorCb
        };

        $.ajax(ajaxSettings);



        function ajaxDeleteSuccessCb(res) {
            console.log('Deleting successfull.');
            refreshContactsView();

        }

        function ajaxDeleteErrorCb(err) {
            console.error(err.responseText);
        }
    }
}

function refreshContactsView() {
    var ajaxSettings = {};

    ajaxSettings = {
        type: 'GET',
        contentType: 'application/json',
        url: 'http://localhost:3000/contact-list',
        success: ajaxGetSuccessCb,
        error: ajaxGetErrorCb
    };

    $.ajax(ajaxSettings);



    function ajaxGetSuccessCb(data) {
        createContactListAddToDom(data);
    }

    function ajaxGetErrorCb(err) {
        console.error(err);
    }


    function createContactListAddToDom(contactList) {
        var contactListHtml = '';

        for (var i = 0; i < contactList.length; i++) {
            contactListHtml +=
                '\n' +
                '<tr class="contact-list">' +
                '   <td class="contact-list-el">' + contactList[i].name + '</td>' +
                '   <td class="contact-list-el">' + contactList[i].email + '</td>' +
                '   <td class="contact-list-el">' + contactList[i].number + '</td>' +
                '   <td>' +
                '       <button type="submit" class="btn btn-danger delete-contact-btn" id="' + contactList[i].id + '">Delete</button>' +
                '   </td>' +
                '</tr>';
        }

        $('.contact-list').remove();
        $('tbody').append(contactListHtml);
    }
}