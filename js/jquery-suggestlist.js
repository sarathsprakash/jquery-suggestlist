( function( $ ) {
	
	function Suggestlist( element, options ) {
		var that = this;
		this.element = $( element ).attr( 'autocomplete', 'off' ).addClass( 'suggestlist-input' );
		this.options = $.extend( $.fn.suggestlist.defaults, options );
		this.picker = DPGlobal.render( options ).on( 'click.suggestlist', 'li', $.proxy( this.clickLi, this ) );
		this.isInput = this.element.is( 'input' );
		this.destroy = function() {
			that.hide();
			that.picker.remove();
			that.element.off('.suggestlist').removeData( 'suggestlist' )
		}
 
		this.picker.width( this.element.outerWidth() );
		$( document ).on( 'mousedown.suggestlist', function ( event ) {
			// Clicked outside the datepicker, hide it
			if ( $( event.target ).closest( '.suggestlist, .suggestlist-input' ).length == 0 ) {
				that.hide();
				
			}
		});
		
		
		if ( this.isInput ) {
			this.element.on( {
				'focus.suggestlist': $.proxy( this.show, this ),
				'click.suggestlist': $.proxy( this.click, this ),
				'keydown.suggestlist': $.proxy( this.keydown, this ),
				'keyup.suggestlist': $.proxy( this.updateLi, this )
			} );
			this.updateLi();
		}
	}

	Suggestlist.prototype = {
		constructor: Suggestlist,

		click: function() {
			if ( this.picker.is( ':hidden' ) ) {
				
				this.show();
			} 
		},

		clickLi: function( event ) {
			this.picker.find( 'li.suggestlist-selected' ).removeClass( 'suggestlist-selected' );
			$( event.currentTarget ).addClass( 'suggestlist-selected' );
			this.element[0].focus();
			this.updateVal();
		},

		keydown: function( event ) {
			switch( event.keyCode ) {
			case 27: // ESC
				this.hide();
				event.preventDefault();
				break;
			case 9: // Tab
				this.hide();
				break;
			case 38: // Up
				if ( this.picker.is( ':not(:visible)' ) ) {
					this.show();
					return;
				}
			       this.selectPrev();
				break;
			case 40: // Down
				if ( this.picker.is( ':not(:visible)' ) ) {
					this.show();
					return;
				}
				if(this.element.is(':not(:visible)'))
				{
				  	this.picker.find( 'li.suggestlist-selected' ).removeClass( 'suggestlist-selected' );
				}
			this.selectNext();
				break;
			case 13: // Enter
				if ( this.picker.is( ':visible' ) ) {
					this.updateVal();
					event.preventDefault();
				}
				break;
			}
		},

		show: function( event ) {
			this.picker.show();
			this.place();
			$( window ).on( 'resize.suggestlist', $.proxy( this.place, this ) );
			if ( event ) {
				event.stopPropagation();
				event.preventDefault();
			}
		},

		hide: function( event ) {
		        
			this.picker.hide();
			// For removing old option upon hiding modal box
			if(this.element.is(":hidden")==true)
			this.picker.find( 'li.suggestlist-selected' ).removeClass( 'suggestlist-selected' );
			$( window ).off( 'resize', $.proxy( this.place, this ) );
		},

		place: function() {
			var offset = this.element.offset();
			this.picker.css( {
				left: offset.left,
				top: offset.top + this.element.outerHeight()
			} );
		},

		selectNext: function() {
			var $selected, $target;
			$selected = this.picker.find( 'li.suggestlist-selected' ).first();

			if ( $selected.length === 0 ) {
				$target = this.picker.find( 'li' ).first();
			} else {
				if ( $selected.is( ':last-child' ) ) {
					return;
				}
				$target = $selected.removeClass( 'suggestlist-selected' ).next();
			}
			$target.addClass( 'suggestlist-selected' );
		},

		selectPrev: function() {
			var $selected, $target;
			$selected = this.picker.find( 'li.suggestlist-selected' ).first();

			if ( $selected.length === 0 ) {
				$target = this.picker.find( 'li' ).last();
			} else {
				if ( $selected.is( ':first-child' ) ) {
					return;
				}
				$target = $selected.removeClass( 'suggestlist-selected' ).prev();
				
			}
			$target.addClass( 'suggestlist-selected' );
		},

		updateVal: function() {
			this.element.val( this.picker.find( 'li.suggestlist-selected' ).first().text() );
			this.hide();
		},

		updateLi: function( event ) {
		       
		      	 //Removed Code
		    if ( event ) {
				//var keyVal = String.fromCharCode( event.keyCode ).toLowerCase();
				if ( event.ctrlKey || event.which== 13 || event.which== 9 || event.which== 40 || event.which== 38 || event.which== 27 ) {
					return;
				}
			}

                      
		        	var val = $.trim( this.element.val() ).replace(/\s+/, ' '),
				$li = this.picker.find( 'li' ),
			        $selected = $li.filter('.suggestlist-selected').first();
		       	         //Removed Code
		       	       /*if ($selected.text().match(val)) {
				return;
		       	       } 
		      	       */
		         /*	if ( $.inArray( val, this.options.list ) === -1 ) {
				return false;
		              }
		              */
		   
		         /*******Selecting matched listed elements******/
		      	$li.removeClass( 'suggestlist-selected' );
			this.picker.find( 'li' ).each( function( i, elem ) {
				if(val.length >0)
				{
				
			      if ($( elem ).text().match("^"+val)) {
					
					$( elem ).removeClass('suggestlist-selected').addClass( 'suggestlist-selected' );
				        
				}
				else
				$( elem ).removeClass('suggestlist-selected');
				}
				
			} );
		          
		         
			if ( event ) {
				this.show();
			}
		}

	};

	var DPGlobal ={
		render: function( options ) {
			var $list = $( '<ul/>' ), i;
			$list.addClass( 'suggestlist' )
				.css( {
					zIndex: getClosestZIndex( this.element )
				} );

			for( i = 0; i < options.list.length; i++ ) {
				$list.append( '<li>' + options.list[i] + '</li>' );
				if ( i === 0 ) {
					$list.addClass( 'suggestlist-selected' );
				}
			}
			$list.appendTo( 'body' );
			return $list;
		}
	};

	/* Helper functions */
	function getClosestZIndex( elem ) {
		if ( !elem ) return;
		return parseInt( elem.parents().filter( function() {
			return $( this ).css( 'z-index' ) !== 'auto';
		} ).first().css( 'z-index' ), 10 );
	};


	/* Add suggestlist to jQuery */
	$.fn.suggestlist = function( option) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each( function () {
			var $this = $( this ),
				data = $this.data( 'suggestlist' ),
				options = typeof option == 'object' && option;
			if ( !data ) {
				data = new Suggestlist( this, $.extend({}, $.fn.suggestlist.defaults, options ) );
				$this.data( 'suggestlist', data);
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				data[option].apply(data, args);
			}
		});
	}

	$.fn.suggestlist.defaults = {
		list: []
	};

} ) ( jQuery );
