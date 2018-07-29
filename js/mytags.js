class MyTags {
  constructor(target_id, placeholder, data) {
    this.data = data.slice();
    this.added_set = {};
    this.added_list = [];
    this.container = $('#'+target_id);
    this.container.addClass('mytags-container');

    this.tagfield = $('<div>', {
      'class': 'mytags-tagfield'
    });
    this.taglist = $('<div>', {
      'class': 'mytags-taglist',
      'data-placeholder': placeholder
    });
    this.dropbtn = $('<span>', {
      'class': 'mytags-icon-btn',
      'text': '\u25BC'
    });
    this.autocompbox = $('<div>', {
      'class': 'mytags-autocompbox'
    });
    this.tagfilter = $('<input>', {
      'type': 'text',
      'placeholder': 'filter',
      'autocomplete': 'off'
    });

    this.ul = $('<ul>');

    this.container.append(this.tagfield);
    this.tagfield.append(this.taglist);
    this.tagfield.append(this.dropbtn);

    this.container.append(this.autocompbox);
    this.autocompbox.append(this.tagfilter);
    this.autocompbox.append(this.ul);
    this.autocompbox.hide();

    this.tagfilter.keypress(function(e){
      if ( e.which == 13 ) e.preventDefault();
    });

    this.tagfilter.keyup(() => {
      this.Regen();
    });

    $(document).mouseup((e) => {
      if(!this.autocompbox.is(e.target) && this.autocompbox.has(e.target).length === 0) {
        this.autocompbox.hide();
      }
    });

    this.dropbtn.click(() => {
      this.ShowList();
    });

    this.autocompleter = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: this.data
    });
    this.autof = this.autocompleter.ttAdapter();
  }

  ShowList() {
    this.Regen();
    this.autocompbox.show();
    this.tagfilter.focus();
  }

  Regen() {
    this.ul.empty();
    let filt;
    let Myf = (sug) => {
      filt = sug;
    };
    this.autof(this.tagfilter.val(), Myf);
    if(filt.length === 0) filt = this.data;
    filt = filt.filter((x) => {
      return !this.added_set[x];
    });

    for (let i in filt) { 
      let entry = filt[i];
      this.ul.append($('<li>').text(entry));
    }

    let _this = this;
    this.ul.children().click(function() {
      let x = $(this).text();
      _this.added_set[x] = true;
      _this.added_list.push(x);
      _this.Regen();
      _this.tagfilter.focus();
    });

    this.taglist.empty();
    (this.added_list).forEach(element => {
      this.taglist.append($('<span>', {
        'class': 'mytags-tag',
        'data-myval': element
      }).text(element));
    });

    this.taglist.children().click(function() {
      let x = $(this).data('myval');
      let idx = $(this).index();
      delete _this.added_set[x];
      _this.added_list.splice(idx, 1);
      _this.Regen();
    });
  }
  
  get value() {
    return this.added_list.slice();
  }
}
