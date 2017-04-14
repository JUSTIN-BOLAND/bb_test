/*jslint regexp: true, browser: true, unparam: true, sloppy: true, forin: true,
nomen: true, plusplus: true, maxerr: 50, indent: 4 */

// Namespace widget for test harness:
DDC.classes.namespace('DDC.Widgets.v9.inventoryListing.v1');

(function () {
	var window = this,
		DDC = window.DDC,
		$ = window.jQuery,

		// Declares names of cookies used by inventory listing.
		cookies = {
			// Stores a comma-separated list of selected inventory item UUIDs
			// for comparison.
			compare: 'DDC.inventory-compare.selected',
			// Stores the exact inventory listing URL for use by
			// "back to inventory" links on subsequent pages.
			referer: 'DDC.inventory.referer',
			// Stores the last selected view,
			view: 'DDC.inventory.view'
		},

		// Path used to write the cookie.
		cookiePath = document.location.pathname.toString(),

		// Named reusable jQuery selectors.
		selectors = {
			form: 'form',
			compareForm: '#compareForm',
			checkbox: ':checkbox',
			checked: ':checked',
			compare: '#compareForm [type=submit]',
			compareSubmitLink: '.compare-submit-link',
			reset: '#compareForm button[type=reset]',
			itemIds: '[name=itemIds]',
			toggle: '.toggle',
			toggles: '.toggle a',
			inventoryList: '.inventoryList',
			hproduct: '.hproduct',
			label: 'label',
			ul: 'ul',
			li: 'li',
			mod: '.mod, .ddc-content',
			hide: '.hide',
			url: '.url',
			constraintsToggle: '.constraintsToggle',
			rangeField: ':input.minmax',
			minRangeField: '.min-range',
			maxRangeField: '.max-range',
			ddcRow: '.yui3-g, .ddc-row',
			photosPhoto: '.inventory-image-default .photo:not(.thumb)',
			photosThumb: '.inventory-image-default .photo.thumb',
			facebookDialogButton: '.facebook-connect-login.dialog',
			// ported from facetbrowse
			facetBrowseMod: '.mod:has([name=facetbrowse]), .ddc-content:has([name=facetbrowse])',
			facetbrowseForm: 'form:has([name=facetbrowse])',
			refresh: '.mod:has([name=facetbrowse]) .refresh, .ddc-content:has([name=facetbrowse]) .refresh',
			select: 'select',
			unsatisfiedDependent: '.unsatisfiedDependent',
			option: 'option',
			input: ':input:not([type=submit])',
			submit: '[role=button]',
			listingConfigId: '[name=listingConfigId]',
			loading: '.loading',
			carfax: '.carfax'
		},

		// Named reusable class names.
		classes = {
			selected: 'selected',
			disabled: 'disabled'
		},

		// Page- and user-level events.
		// Key names must correspond to key names in the handlers.page object.
		events = {
			// Page-level events have arbitrary values.
			page: {
				compareReset: 'compare-reset',
				compareUpdate: 'compare-update',
				toggle: 'toggle.view',
				constraintsToggle: 'constraints-toggle',
				updateRanges: 'update-ranges',
				photoSelect: 'photo-select',
				// ported from facetbrowse
				facetbrowseRefresh: 'facetbrowse-refresh',
				startLoading: 'start-loading',
				stopLoading: 'stop-loading'
			},
			// User-level events have a value equivalent to the event type.
			user: {
				toggleClick: 'click',
				resetClick: 'click',
				compareClick: 'click',
				compareSubmit: 'submit',
				compareSubmitLinkClick: 'click',
				constraintsToggleClick: 'click',
				rangeChange: 'change',
				photosThumbClick: 'click',
				facebookDialogButtonClick: 'click',
				// ported from facetbrowse
				selectChange: 'change',
				refreshClick: 'click',
				hproductClick: 'click',
				carfaxClick: 'click'
			}
		},

		// Corresponds user-level event key names to selectors.
		// Key names must correspond to key names in the `handlers.page` object.
		eventsMap = {
			user: {
				live: {
					toggleClick: selectors.toggles,
					resetClick: selectors.reset,
					constraintsToggleClick: selectors.constraintsToggle,
					photosThumbClick: selectors.photosThumb,
					facebookDialogButtonClick: selectors.facebookDialogButton,
					hproductClick: selectors.hproduct,
					carfaxClick: selectors.carfax,
					// ported from facetbrowse
					refreshClick: selectors.refresh
				},
				traditional: {
					compareClick: selectors.compareForm + ' ' +
					selectors.checkbox,
					compareSubmit: selectors.compareForm,
					compareSubmitLinkClick: selectors.compareSubmitLink,
					rangeChange: selectors.rangeField,
					// ported from facetbrowse
					selectChange: selectors.facetbrowseForm + ' ' + selectors.select
				}
			}
		},

		/**
		 * Returns selected inventory item UUIDs in the `cookies.compare` cookie
		 * as an array.
		 */
		getCompareCookieValue = function () {
			var cookieValue = $.cookie(cookies.compare);
			if (cookieValue) {
				cookieValue = cookieValue.split(',');
			}
			return cookieValue || [];
		},

		/**
		 * Sets selected inventory item UUIDs in the `value` array as a comma-
		 * separated list in the `cookies.compare` cookie.
		 */
		setCompareCookieValue = function (value) {
			$.cookie(cookies.compare, value, { path: '/' });
			$.cookie(cookies.compare, value, { path: cookiePath });
		},

		/**
		 * Sets the `cookies.referer` cookie to the value of `window.location`
		 * for use with "back to inventory" links on subsequent pages.
		 */
		setListingCookieValue = function () {
			$.cookie(cookies.referer, cookiePath, { path: '/' });
		},

		/**
		 * Returns value of current view name from the `cookies.view` cookie.
		 */
		getViewCookieValue = function () {
			return $.cookie(cookies.view) || '';
		},

		/**
		 * Sets the value of `cookies.view` cookie to `value`, the name of
		 * the currently active view.
		 */
		setViewCookieValue = function (value) {
			$.cookie(cookies.view, value, { path: '/' });
			$.cookie(cookies.view, value, { path: cookiePath });
		},


		bindTraditionalHandlers = function () {},

		/**
		 * Enables the facetbrowse form, allowing for user interaction.
		 */
		enableForm = function (form) {
			if (form) {
				$(form).find(selectors.select + ', ' + selectors.input)
					.not(selectors.unsatisfiedDependent)
					.removeAttr('disabled');
				$(form).find(selectors.submit).button('enable');
				$(form).parent().find('a[role=button]').css('visibility', 'visible');
			}
		},

		/**
		 * Disables the facetbrowse form.  This is used when facetbrowse must
		 * take potentially prolonged action like an XHR request.
		 */
		disableForm = function (form) {
			if (form) {
				$(form).find(selectors.select + ', ' + selectors.input)
					.attr('disabled', 'disabled');
				$(form).find(selectors.submit).button('disable');
				$(form).parent().find('a[role=button]').css('visibility', 'hidden');
			}
		},

		useSEOURL = function(formFields, pageName) {
			var inventoryPages = ['INVENTORY_LISTING_DEFAULT_AUTO_NEW', 'INVENTORY_LISTING_DEFAULT_AUTO_USED', 'INVENTORY_LISTING_DEFAULT_AUTO_CERTIFIED_USED'];

			if(inventoryPages.indexOf(pageName) > -1 && (formFields.selectedMake.length === 1 && formFields.selectedMake.val() != '' && formFields.selectedModel.length <= 1 )){
				return true;
			}

			return false;
		},

		getSEOURLAction = function(formFields, pageName, canonicalUrl) {
			var baseUrl = '',
				baseUrlMatch,
				baseSEOUrlRegEx = /inventory\/(new|used|certified-preowned)/,
				inventoryType = '',
				actionParams = '',
				make = '',
				model = '',
				linkParser = document.createElement('a'),
				finalUrl = '';

			if (canonicalUrl !== undefined) {
				linkParser.href = canonicalUrl;
				baseUrlMatch = baseSEOUrlRegEx.exec(linkParser.pathname);
			}

			if(!baseUrlMatch) {
				switch(pageName){
					case 'INVENTORY_LISTING_DEFAULT_AUTO_NEW':
						inventoryType = 'new';
						break;
					case 'INVENTORY_LISTING_DEFAULT_AUTO_USED':
						inventoryType = 'used';
						break;
					case 'INVENTORY_LISTING_DEFAULT_AUTO_CERTIFIED_USED':
						inventoryType = 'certified-preowned';
						break;
					default:
						// If this vlp is not configured for SEO
						// don't change form action
						return undefined;
				}

				baseUrl = '/inventory/' + inventoryType;
			} else {
				baseUrl = '/' + baseUrlMatch[0];
			}

			if(formFields.selectedMake.length){
				make = DDC.seoEncodeString(formFields.selectedMake.val());
				actionParams += make;
			}

			if(formFields.selectedModel.length && formFields.selectedModel.val()){
				model = DDC.seoEncodeString(formFields.selectedModel.val());
				actionParams += "-" + model;
			}

			finalUrl = baseUrl + '/' + actionParams + '/';
			return finalUrl;
		},

		// Corresponds page- and user-level event key names to
		// handler functions.
		handlers = {
			page: {
				/**
				 * Sets inventory compare cookie to empty and unchecks any
				 * checked inventory items on the page.
				 *
				 * $(document).trigger('compare-reset');
				 */
				compareReset: function () {
					setCompareCookieValue([]);
					$(selectors.compareForm + ' ' + selectors.checkbox)
						.attr('checked', false);

					$(document).trigger(events.page.compareUpdate);
					$(document).trigger('trackEvent', [{
						widgetName: 'inventory-listing',
						eventName: 'compare reset'
					}]);
				},

				/**
				 * Performs compare-related cleanup.
				 *
				 * 1) If an inventory item UUID is passed via `data.id` and it
				 * corresponds to a checked inventory item on the page, it is
				 * added to the list of selected inventory item UUIDs maintianed
				 * in the `cookies.compare` cookie.  Otherwise, it is removed.
				 *
				 * 2) The value of the hidden field maintaining all cross-page
				 * inventory item compare selections is set to the value of the
				 * `cookies.compare` cookie.
				 *
				 * 3) Inventory items which are selected for comparison on get
				 * a class `classes.selected`.  Inventory items no longer
				 * selected for comparison have the class removed.
				 *
				 * 4) Compare button states are refreshed.  If there is at least
				 * one item selected, then the reset button is enabled
				 * (otherwise disabled).  If there are at least 2 items
				 * selected, then the compare button is enabled
				 * (otherwise disabled).
				 *
				 * $(document).trigger('compare-update');
				 * $(document).trigger('compare-update', [{id: 'uuid'}]);
				 */
				compareUpdate: function (e, data) {
					var i,
						checked,
						cookieValue = getCompareCookieValue(),
						itemIds,
						inCookieList = false,
						cookieList = [];

					// if data.id corresponds to a checked inventory item on
					// the page, add it to the cookie list; otherwise remove it
					if (data && data.id) {
						checked = $('[value=' + data.id + ']', selectors.compareForm).is(':checked');

						if (checked) {
							// add item to compare cookie if not already
							// in list
							cookieList = cookieValue;

							for (i = 0; i < cookieList.length; i++) {
								inCookieList = (cookieList[i] === data.id) ||
									inCookieList;
							}

							if (!inCookieList) {
								cookieList.push(data.id);
							}
						} else {
							// otherwise remove item from compare cookie
							for (i = 0; i < cookieValue.length; i++) {
								if (cookieValue[i] !== data.id) {
									cookieList.push(cookieValue[i]);
								}
							}
						}

						setCompareCookieValue(cookieList);
					} else {
						cookieList = getCompareCookieValue();
					}

					// trigger button refresh
					$(selectors.reset).trigger('mouseout');
					$(selectors.compare).trigger('mouseout');

					// get compare list and convert to a comma-separated string
					itemIds = cookieList.join(',');

					// disable compare links if there are fewer than
					// 2 selected items
					if (cookieList.length < 2) {
						$(selectors.compareSubmitLink).addClass(classes.disabled);
					} else {
						$(selectors.compareSubmitLink).removeClass(classes.disabled);
					}

					// Set value of hidden field to comma-separated list of
					// selected inventory item UUIDs for comparison.
					// This value of this field is submitted to and required by
					// the inventory compare page.
					$(selectors.itemIds).val('').val(itemIds);

					// Remove selected class from inventory items on page.
					// These will be refreshed in a subsequent step.
					$(selectors.hproduct)
						.parents(selectors.li)
						.removeClass(classes.selected);

					if (cookieList.length) {
						// If compare list has any selection, enable the reset
						// button and mark selected inventory items on page.
						$(selectors.reset).button('enable');
						$('[value=' + cookieList.join('], [value=') + ']')
							.parents(selectors.li)
							.addClass(classes.selected);
					} else {
						// If compare list is 0-length,
						// disable thereset button.
						if(!$(selectors.reset).hasClass('ie8-remove-disabled')) {
							$(selectors.reset).button('disable');
						}
						else {
							$(selectors.reset).addClass('ui-button-disabled ui-state-disabled');
						}
					}

					if (cookieList.length > 1) {
						// If compare list has 2 or more selections,
						// enable the compare button.
						$(selectors.compare).button('enable');
					} else {
						// If compare list has 1 or fewer selections,
						// disabled the compare button.
						if(!$(selectors.compare).hasClass('ie8-remove-disabled')) {
							$(selectors.compare).button('disable');
						}
						else {
							$(selectors.compare).addClass('ui-button-disabled ui-state-disabled');
						}
					}
				},

				/**
				 * Sets value of `cookies.view` to the selected view passed with
				 * `data.view`.  Updates classes on inventory lists to match
				 * selected view.
				 */
				toggle: function (e, data) {
					var viewName;

					if (data && data.view) {
						viewName = data.view;
						// remove existing view classes from inventory list
						$(selectors.toggles).each(function (i, item) {
							$(selectors.inventoryList)
								.removeClass($(item).attr('data-view'));
						});
						// add selected view class to inventory list
						$(selectors.inventoryList).addClass(viewName);

						// remember selected view in a cookie
						setViewCookieValue(viewName);

						$(document)
							.trigger('trackEvent', [{
								widgetName: 'inventory-listing',
								eventName: 'view type change',
								data: viewName
							}]);
						// adding event to notify when toggle is changed
						$(selectors.compareForm).trigger('inventory-listing-toggle');
					}
				},

				/**
				 * Toggles visibility of a portion of the constraints listed
				 * for a facet with the given toggle link element `data.toggle`.
				 *
				 * Facet constraint lists may have a capped number
				 * of constraints.
				 *
				 * Learn more:  /v9/components/inventory-search/facetlist/v1/
				 */
				constraintsToggle: function (e, data) {
					var toggleModParent;

					if (data && data.toggle) {
						toggleModParent = $(data.toggle)
							.parents(selectors.mod).eq(0);
					}

					if (toggleModParent &&
							$(toggleModParent).find(selectors.hide).size()) {
						$(toggleModParent)
							.find(selectors.hide)
							.removeClass(selectors.hide.replace('.', ''));

						if (data && data.less && data.toggle) {
							$(data.toggle).html(data.less);
						}
					} else if (toggleModParent &&
							!$(toggleModParent).find(selectors.hide).size()) {
						$(toggleModParent)
							.find(selectors.ul).not(':first')
							.addClass(selectors.hide.replace('.', ''));

						if (data && data.more && data.toggle) {
							$(data.toggle).html(data.more);
						}
					}
				},

				/**
				 * Sets the primary photo `src` to `data.url` if passed and
				 * triggers a `dyanmicUrls` event where
				 * `imageUrl` equals `data.url`.
				 *
				 * Learn more about dynamic URLs:
				 * /v9/documentation/js/dynamic-urls/
				 */
				photoSelect: function (e, data) {
					if (data && data.url) {
						$(document).trigger('dynamicUrls', [{
							imageUrl: data.url
						}]);
						$(selectors.photosPhoto).attr('src', data.url);
					}
				},

				updateRanges: function () {
					var data, val;

					$(selectors.rangeField).each(function () {
						data = {
							form: $(this).parents(selectors.facetbrowseForm),
							name: $(this).attr('name')
								.replace(/(min-)|(max-)/, ''),
							min: $(this).parents(selectors.ddcRow)
								.find(selectors.minRangeField).val()
								.replace(/[^0-9]*/g, '') || '',
							max: $(this).parents(selectors.ddcRow)
								.find(selectors.maxRangeField).val()
								.replace(/[^0-9]*/g, '') || ''
						};

						val = data.min + ((data.min || data.max) ? '-' : '') +
							data.max;

						if (!$(data.form).find('[name=' + data.name + ']')
								.size()) {
							$(data.form).append('<input type="hidden" ' +
								'class="hide" name="' + data.name + '" />');
						}

						$(data.form).find('[name=' + data.name + ']').val(val);
					});
				},

				startLoading: function () {
					// blur form fields during load sequence as they
					// will be replaced anyway
					$(selectors.facetbrowseForm)
						.find(selectors.select + ', ' + selectors.input)
						.blur();

					// show a loading indicator
					$('<div class="loading">&nbsp;</div>')
						.css({
							position: 'absolute',
							minWidth: '50px',
							minHeight: '50px'
						})
						.appendTo(selectors.facetbrowseForm)
						.position({
							of: $(selectors.facetbrowseForm),
							my: 'center center',
							at: 'center center',
							offset: '0 -50'
						});
				}
			},
			user: {
				/**
				 * Prevents link action from occurring when user clicks
				 * toggle links.
				 */
				toggleClick: function (e) {
					e.preventDefault();
				},

				/**
				 * Triggers a page-level `compare-reset` event.
				 */
				resetClick: function () {
					$(document).trigger(events.page.compareReset);
					return false;
				},

				/**
				 * Triggers a page-level `compare-updated` event with
				 * inventory item UUID from the current checkbox field's value.
				 */
				compareClick: function () {
					var data = {
						id: $(this).val()
					};

					$(document).trigger(events.page.compareUpdate, [data]);
				},

				/**
				 * Allows submit action if more than one inventory item is
				 * selected for comparison; otherwise cancels action.
				 */
				compareSubmit: function () {
					return (getCompareCookieValue().length > 1);
				},

				/**
				 * Triggers compare submission via direct DOM form
				 * submit trigger.
				 */
				compareSubmitLinkClick: function (e) {
					$(selectors.compareForm).trigger(events.user.compareSubmit);
					e.preventDefault();
				},

				/**
				 * Triggers page-level `constraints-toggle` event with toggle
				 * element equal to the clicked element.
				 */
				constraintsToggleClick: function () {
					var data = $.extend({
						toggle: this
					}, $.getDataAttributes(this));

					$(document).trigger(events.page.constraintsToggle, [data]);
					return false;
				},


				/*
				rangeChange: function () {
					$(document).trigger('update-ranges');
				},
				*/

				/**
				 * Triggers page-level `photo-select` event with URL equal to
				 * the clicked element's parent anchor element's `href`.
				 */
				photosThumbClick: function () {
					var data = {
						url: $(this).parent('a').attr('href')
					};

					$(document).trigger(events.page.photoSelect, [data]);
					return false;
				},

				/**
				 * Ensures the Facebook dialog button click event is retriggered
				 * upon completion of the Facebook Connect login procedure to
				 * trigger any dialog which may be additionally associated with
				 * the button.
				 */
				facebookDialogButtonClick: function () {
					var self;

					if (!$(this).data('fb-clicked-once')) {
						self = this;

						$(document).bind('facebookConnectLogin.fb-clicked-once', function () {
							$(document).unbind('facebookConnectLogin.fb-clicked-once');
							$(self).data('fb-clicked-once', true);
							setTimeout(function () {
								$(self).trigger('click');
							}, 150);
						});
					}
				},

				selectChange: function (event) {
					var $form = $(this).parents(selectors.facetbrowseForm),
						formFields = {},
						$makeSelect = $form.find('select[name="make"]'),
						$modelSelect = $form.find('select[name="model"]'),
						dataLayer = DDC.dataLayer,
						enableSEOURLs = dataLayer && dataLayer.site && dataLayer.site.features && dataLayer.site.features.enableSEOURLs,
						currentPageName,
						canonicalLink,
						canonicalLinkUrl,
						seoActionUrl
					;

					// JIRA-24984: When unselecting make, also unselect model
					if ($(event.target).attr('name') === 'make' && $(event.target).attr('value') === '') {
						$form.find('select[name="model"]').val('');
					}

					// If smart SEOs is enabled, and this can be an SEO-friendly URL
					// set the action to SEO-friendly
					if(enableSEOURLs && typeof($makeSelect) !== 'undefined' && typeof($modelSelect) !== 'undefined'){
						formFields.selectedMake = $makeSelect.find(':selected');
						formFields.selectedModel = $modelSelect.find(':selected');
						currentPageName = dataLayer && dataLayer.page && dataLayer.page.pageInfo && dataLayer.page.pageInfo.pageName;

						if(currentPageName && useSEOURL(formFields, currentPageName)){
							canonicalLink = $('link[rel="canonical"]').get(0);
							canonicalLinkUrl = canonicalLink && canonicalLink.href;
							seoActionUrl = getSEOURLAction(formFields, currentPageName, canonicalLinkUrl);

							if(seoActionUrl) {
								$form.attr('action', seoActionUrl);
							}
						}
					}

					$form.submit();
					disableForm($form);
					$(document).trigger(events.page.startLoading);
				},

				rangeChange: function () {
					$(document).trigger('update-ranges');
				},

				refreshClick: function () {
					var data = {
						url: $(this).attr('href'),
						form: $(this)
							.parents(selectors.facetBrowseMod)
							.find(selectors.facetbrowseForm)
					};

					$(document).trigger(events.page.facetbrowseRefresh, [data]);
					return false;
				},

				hproductClick: function (e) {
					if ($(e.target).is('a') === false && $(e.target).parent().is('a') === false && ($(e.target).is('img') === false ||
						($(e.target).is('img') && $(e.target).parent('div').parent('li').hasClass('certified')))) {
						var link = $(e.target).closest(selectors.hproduct).find(selectors.url).attr('href');
						if (link !== "" && link !== undefined) {
							$(document).trigger('hproductClick',[e]);
							window.location = link;
							return false;
						}
					}
				},

				carfaxClick: function (e) {
					$(document).trigger('trackEvent', {
						widgetName: 'inventory-listing',
						eventName: 'logo click',
						data: 'carfax'
					});
				}
			}
		},

		// Initializations are named functions that are executed once on load.
		// Separate intializations into semantically-named functions that each
		// do one specific well-defined thing (for easier maintenance).
		initializations = {
			disableForm: function () {
				var form = $(selectors.facetbrowseForm);
				$(document).ready(function () {
					form.find('select').each(function () {
						if ($(this).attr('disabled')) {
							enableForm(form);
							return false;
						}
					});
				});
			},
			/**
			 * See setListingCookieValue function.
			 */
			listingUrl: function () {
				setListingCookieValue();
			},

			/**
			 * See page-level `compare-update` event.
			 */
			compare: function () {
				$(document).trigger(events.page.compareUpdate);
			},

			/**
			 * See page-level `update-ranges` event.
			 */
			rangeFields: function () {
				$(document).trigger(events.page.updateRanges);
			},

			/**
			 * Moves estimated payment to bottom of list.
			 */
			moveEstimatePayment: function () {
				$('.pricing').each(function () {
					var moveEstimate = $(this).find('.vlp-calc').attr('data-move-estimate-payment');
					if (moveEstimate == 'true') {
						$(this).find('.vlp-calc').appendTo(this);
					}
				});
			}
		};

	bindTraditionalHandlers = function () {
		$.each(eventsMap.user.traditional, function (event) {
			$(eventsMap.user.traditional[event]).unbind(events.user[event])
				.bind(events.user[event], handlers.user[event]);
		});
	};

	$(function () {
		// bind page-level event handlers
		$.each(events.page, function (event) {
			$(document).unbind(events.page[event])
				.bind(events.page[event], handlers.page[event]);
		});
		// bind user-level live event handlers
		$.each(eventsMap.user.live, function (event) {
			$(eventsMap.user.live[event]).die(events.user[event])
				.live(events.user[event], handlers.user[event]);
		});
		// bind user-level traditional event handlers
		bindTraditionalHandlers();
		/*
		$.each(eventsMap.user.traditional, function (event) {
			$(eventsMap.user.traditional[event]).unbind(events.user[event])
				.bind(events.user[event], handlers.user[event]);
		});
		*/
		// execute initialization procedures
		setTimeout(function () {
			$.each(initializations, function (initialization) {
				if ($.isFunction(initializations[initialization])) {
					initializations[initialization]();
				}
			});
		}, 250);
	});

	// expose testable functions to test harness:
	DDC.Widgets.v9.inventoryListing.v1.isTesting = typeof(__karma__) !== 'undefined';

	if(DDC.Widgets.v9.inventoryListing.v1.isTesting){
		DDC.Widgets.v9.inventoryListing.v1.testMethods = {
			useSEOURL: useSEOURL,
			getSEOURLAction: getSEOURLAction
		}
	}
}());
