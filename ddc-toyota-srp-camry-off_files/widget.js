DDC.classes.namespace('DDC.Widgets.v9.inventoryListing.v2');
/*jslint regexp: true, browser: true, unparam: true, sloppy: true, forin: true,
nomen: true, plusplus: true, maxerr: 50, indent: 4 */

/*
  ********************************************************************************
	STRUCTURE OF THIS FILE
	module setion for eventual actual separation for JS build process:
	which should pull the files from home locations:
	-> /htdocs/v9/components/inventory-search/facetmulti/v1/js/component.js
	-> /htdocs/v9/components/inventory-search/facetbreadcrumb/v1/js/component.js
	... adding them to the stripped down version of this widget.js file (bottom)
  ********************************************************************************
*/

/*
  ********************************************************************************
	FACET MULTI COMPONENT JS

	PUBLISHES:
	/facet/search

	SUBSCRIBES:
	/facet/search
	/facet/reposition
	/facets/breadcrumbs/change

  ********************************************************************************
*/

(function ($, DDC) {
	var $form = $('.facetmulti-form'),
		$breadcrumbForm = $('.facet-breadcrumb-form'),
		$inputs = $form.find('input,select'),
		$autoSubmitInputs = $inputs.filter(':radio,:checkbox,select').not('.non-submit'),
		$rangeInputs = $inputs.filter('.facet-user-range-input'),
		$searchField = $form.find('input.search'),
		$loadingIndicator = $('<div class="facet-form-loading">&nbsp;</div>'),
		$paginationLinks = $('.ddc-pagination a'),
		$paymentTypeSelectors = $inputs.filter('[name="payment-selection"]'),
		$paymentTypePanels = $('.payment-panel'),
		$moreLinks,
		charts = {},

		/**
		 * Shows loading indicator overlay over facetmulti controls while refreshing
		 */
		addLoadingIndicator = function (el) {
			$(el).each(function () {
				$loadingIndicator
					.clone()
					.css({
						position: 'absolute',
						minWidth: '50px',
						minHeight: '50px'
					})
					.appendTo(this)
					.position({
						of: $(this),
						my: 'center center',
						at: 'center top',
						offset: '0 ' + (60 + $(window).scrollTop())
					});
			});
		},

		removeLoadingIndicator = function (el) {
			var loadingIndicatorSelector = '.' + $loadingIndicator.attr('class');
			$(el).each(function () {
				$loadingIndicator = $(this).find(loadingIndicatorSelector).remove();
			});
		},

		disableFacetControls = function () {
			//clear out the search placeholder text as it will be passed in a submit on IE9
			if ($searchField.val() === $searchField.attr('placeholder')) {
				$searchField.val('');
			}

			$form.addClass('facet-form-disabled');
			addLoadingIndicator($form);
			$inputs.not('[type="hidden"]').each(function (i, el) {
				var $el = $(el);
				var elname = $el.attr('name');
				// make duplicate of inputs for visual substitution (don't actually disable real inputs)
				var fake = $el.clone().attr('name', elname + 'fake').prop('disabled', true);
				$el.hide();
				$el.after(fake);
			});
		},

		enableFacetControls = function () {
			$form.removeClass('facet-form-disabled');
			$form.find('[name$="fake"]').remove();
			$inputs.not('[type="hidden"]').each(function (i, el) {
					$(el).show();
				});
			removeLoadingIndicator($form);
		},

		refreshRangeInputValues = function (rangeSelector) {
			$(rangeSelector).each(function (i) {
				var $range = $(this),
					rangeName = $range.attr('name'),
					rangeValue = '{MIN}-{MAX}',
					$min = $('.' + rangeName + '-min').not(":disabled"),
					$max = $('.' + rangeName + '-max').not(":disabled"),
					minValClean,
					minValFormatted,
					maxValClean,
					maxValFormatted,
					format,
					values = [],
					validator = $form.data('validator');

				if(!$min.length || !$max.length) {
					return;
				}

				// CLEAN AND REORDER
				values = [cleanRangeInput($min.val()), cleanRangeInput($max.val())];
				if (values[0] !== '' && values[1] !== '') {
					values.sort(function (a, b) { return a - b; });
				}
				minValClean = values[0];
				maxValClean = values[1];

				// FORMAT
				minValFormatted = formatRangeInput(minValClean, $min.data('format'));
				maxValFormatted = formatRangeInput(maxValClean, $max.data('format'));

				// POPULATE
				$min.val(minValFormatted);
				$max.val(maxValFormatted);

				// For facets with the include "no price available" style (zero) constraints, lower bound the range to 1
				if (!minValClean &&  maxValClean && $range.parents('.facet-user-range').find('.facet-user-range-allow-zero').length > 0) {
					minValClean = 1;
				}

				if ((minValClean !== '') || (maxValClean !== '')) {
					rangeValue = rangeValue.replace('{MIN}', minValClean).replace('{MAX}', maxValClean);
				} else {
					rangeValue = '';
				}

				$range.val(rangeValue);

				if (rangeValue) {
					$range.prop('disabled', false);
				} else {
					$range.prop('disabled', true);
				}

				// VALIDATE
				// not available at init, but should be loaded by the time user enters values
				if (!$form.data("validator") && $.tools && $.tools.validator) {
					initValidation();
					validator = $form.data("validator");
				}

				if (validator) {
					validator.checkValidity();
				}
			});
		},

		formatRangePlaceholders = function (rangeInputSelector) {
			$(rangeInputSelector).each(function (i) {
				var $this = $(this),
					placeholderText = $this.attr('placeholder'),
					format;

				$this.attr('placeholder', formatRangeInput(placeholderText, $this.data('format')));
			});
		},

		cleanRangeInput = function (value) {
			var clean = value;

			if (typeof value === 'string' && value !== '') {
				clean = Number(value.replace(/[^0-9\.]+/g, ""));
			}

			return clean;
		},

		formatRangeInput = function (value, format) {
			var formatted = value;
			switch (format) {
			case 'currency':
				// Note DDC.format.currency (or DDC.format.number) does not handle zero
				if (DDC && DDC.hasOwnProperty('format') && DDC.format.hasOwnProperty('currency') && value !== 0 && value !== "0") {
					formatted = DDC.format.currency(value);
				} else {
					if (value !== 0 && value !== "0") {
						formatted = '$' + value;
					} else {
						formatted = '$0';
					}
				}
				break;

			default:
				break;
			}
			return formatted;
		},

		addFacetGoButton = function (inputEl) {
			var $input = $(inputEl),
				$parent = $input.closest("li"),
				$go = $parent.find('.facet-user-range-go-button'),
				$newGo = $('<button class="facet-user-range-go-button ddc-btn ddc-btn-primary ddc-btn-small" type="submit">Go</button>'),
				hasGo = $go.length > 0;

			if (!hasGo) {
				if (DDC.hasOwnProperty('i18n')) {
					$newGo.text(DDC.i18n.getLabel('GO'));
				}
				$parent.append($newGo);
				$('button.facet-user-range-go-button').on('click', function() {
					$('.last-facet-interacted').val($(this).closest('.facetmulti-item').find('.facet-anchor').attr('id'));
				});
			}
		},

		removeFacetGoButton = function (inputEl) {
			var $input = $(inputEl),
				$parent = $input.closest("li"),
				$go = $parent.find('.facet-user-range-go-button'),
				hasGo = $go.length > 0;

			if (hasGo) {
				$go.remove();
			}
		},

		initValidation = function () {

			if ($.tools && $.tools.validator) {

				// Modified 'append-under' effect: /htdocs/v9/media/js/ddc/v1/modules/validator.js
				$.tools.validator.addEffect("append-to-facet", function (errors, event) {
					var conf = this.getConf();
					$.each(errors, function (index, error) {
						// invalid input
						var input = error.input.addClass(conf.errorClass),
							msg = input.data('msg.el');

						if (!msg) {
							msg = conf.message.clone().insertAfter(input.parents('.facet-user-range').find('.facet-user-range-max'));
							input.data('msg.el', msg);
						}

						msg.addClass('hide').children().remove();
						$.each(error.messages, function (i, v) {
							conf.messageItem.clone().append(v).appendTo(msg);
						});
						msg.removeClass('hide');
					});
				}, function (inputs) {
					// hide
					var conf = this.getConf();
					if (inputs && inputs.size()) {
						inputs.removeClass(conf.errorClass).each(function () {
							if ($(this).data('msg.el')) {
								$(this).data('msg.el').addClass('hide');
							}
						});
					}
				});

				// Modified from standard validator: /htdocs/v9/media/js/ddc/v1/modules/validator.js
				$form.validator({
					errorInputEvent: 'keyup',
					inputEvent: 'change',
					formEvent: 'null', // done manually via change and submit handlers
					effect: 'append-to-facet',
					message: $('<div class="errors facet-user-range-input-error"/>'),
					messageItem: $('.templates .error:eq(0)', $form).size() ? $('.templates .error:eq(0)', $form) : $('<small/>'),
					onFail: function (e, errorArray) {
						var form = this.getForm(),
							$currentInput;
						// ensure reflow in IE
						if (!$.support.changeBubbles) {
							// Re-flows source elements in IE fixing DOM overlap issues
							$(form).parents('[class*=yui3-g]:eq(0)').addClass('reflow');
						}
						// No shake effect needed, but remove submit buttons
						for (var i = 0; i < errorArray.length; i++) {
							$currentInput = $(errorArray[i].input);
							removeFacetGoButton($currentInput);
						}
					},
					onSuccess: function (e, validArray) {
						// Remove global error messages
						$('.facet-user-range-global-error').remove();
					}
				});

				$.tools.validator.fn($('.facet-user-range-min-input'), function (input, value) {
					var $this = $(input),
						test = true,
						max = $this.data('max'),
						format = $this.data('format'),
						message = 'PLEASE_ENTER_A_NUMBER_LESS_THAN_OR_EQUAL_TO';

					max = cleanRangeInput(max);
					value = cleanRangeInput(value);

					if (value !== '' && max && max < value) {
						test = false;
					}

					if (DDC.hasOwnProperty('i18n')) {
						message = DDC.i18n.getLabel(message) || message;
						message = message.replace('{0}', formatRangeInput(max, format)).replace('&lt;&eq;', '<');
					}

					return (test) ? true : message;
				});

				$.tools.validator.fn($('.facet-user-range-max-input'), function (input, value) {
					var $this = $(input),
						min = $this.data('min'),
						test = true,
						format = $this.data('format'),
						message = 'PLEASE_ENTER_A_NUMBER_GREATER_THAN_OR_EQUAL_TO';

					min = cleanRangeInput(min);
					value = cleanRangeInput(value);

					if (value !== '' && min && min > value) {
						test = false;
					}

					if (DDC.hasOwnProperty('i18n')) {
						message = DDC.i18n.getLabel(message) || message;
						message = message.replace('{0}', formatRangeInput(min, format)).replace('&gt;&eq;', '>');
					}

					return (test) ? true : message;
				});
			}
		},

		initSubscriptions = function () {
			$.subscribe('/facets/search', disableFacetControls);
			$.subscribe('/facets/reposition', positionAnchor);
			$.subscribe('/facets/breadcrumbs/change', updateBreadCrumbAction)
		},

		// Generate the user range histograms from the data attributes embedded in the div
		initHistogramCharts = function ($context) {
			$('div[data-range-chart-values]', $context).each(function () {
				var $chartDiv = $(this),
					showChart = $chartDiv.data('show'),
					rangeValues = $chartDiv.data('range-chart-values'),
					bucketSize = $chartDiv.data('bucket-val'),
					isDiscrete = bucketSize === 1,
					maxX = $chartDiv.data('range-chart-max-val'),
					minX = $chartDiv.data('range-chart-min-val'),
					gridColor =  $chartDiv.css("border-left-color"),
					textColor =  $chartDiv.css("color"),
					barColor = $chartDiv.css("border-top-color"),
					barHighlightColor = $chartDiv.css("border-right-color"),
					outOfRangeColor = $chartDiv.css("border-bottom-color"),
					chartName = $chartDiv.attr('id'),
					align = isDiscrete ? "center" : "left",
					xTickSize = null, // tickSize null = use the automatic generated value from flot
					$yAxisLabels;

				if(!showChart || charts.hasOwnProperty(chartName)) {
					return;
				}

				var flotOptions = {
					series: {
						bars: {
							show: true,
							align: align,
							barWidth: bucketSize,
							lineWidth: 0,
							fillColor: barColor
						}
					},
					selection: {
						mode: "x",
						fillColor: outOfRangeColor,
						strokeColor: barHighlightColor
					},
					xaxis: { //TODO - not thrilled with this...
						tickFormatter: function formatter(val, axis) {
							if (chartName.indexOf('internetPrice') > -1) {
								return '$' + Math.floor(val / 1000) + 'k';
							} else if (chartName.indexOf('odometer') > -1) {
								return Math.floor(val / 1000) + 'k';
							} else if (chartName.indexOf('year') > -1) {
								return "'" + Math.floor(val).toString(10).substring(2);
							} else if (chartName.indexOf('payment') > -1) {
								return '$' + val;
							}else {
								return val;
							}
						},
						tickSize: xTickSize,
						minTickSize: 1,
						font: {
							color: textColor
						},
						min: isDiscrete ? undefined : minX,
						max: isDiscrete ? undefined : maxX
					},
					yaxis: {
						tickFormatter: function formatter(val, axis) {
							return Math.floor(val);
						},
						minTickSize: 1,
						font: {
							color: textColor
						}
					},
					grid: {
						clickable: false,
						borderWidth: 0,
						color: gridColor
					},
					highlightColor: barHighlightColor
				};

				//Only display a range chart if there is more than 1 value
				if(rangeValues.length > 1){
					$chartDiv.addClass('facet-user-range-chart-render');

					//Keep a reference to the chart for later use
					charts[chartName] = renderPlot($chartDiv, [rangeValues], flotOptions);

					if ($chartDiv.data("yaxis-label")) {
						$yAxisLabels = $chartDiv.find(".flot-y-axis");
						$yAxisLabels.find("div:last").clone().text($chartDiv.data("yaxis-label")).css("top","-11px").appendTo($yAxisLabels);
					}

					$chartDiv.removeClass('facet-user-range-chart-render');
					$chartDiv.addClass('facet-user-range-chart-ready');
				}
			});
		},

		/* Utility function to provide endpoints to range indicators in sliders and histogram */
		getRangeDetails = function ($context) {
			var $inputGroup = $context.children('div.facet-user-range-input-group').first(),
				$minInput = $inputGroup.find('.facet-user-range-min-input'),
				$maxInput = $inputGroup.find('.facet-user-range-max-input'),
				minLimit = $minInput.attr('data-min') ? parseInt($minInput.attr('data-min'), 10) : 0,
				maxLimit = $maxInput.attr('data-max') ? parseInt($maxInput.attr('data-max'), 10) : 0,
				minValue = $minInput.val() ? parseInt($minInput.val().replace(/[^-\d\.]/g, ''), 10) : minLimit,
				maxValue = $maxInput.val() ? parseInt($maxInput.val().replace(/[^-\d\.]/g, ''), 10) : maxLimit,
				inputFormat = $minInput.data('format') || $maxInput.data('format');

			return {
				'$minInput' : $minInput,
				'$maxInput' : $maxInput,
				'minLimit' : minLimit,
				'maxLimit' : maxLimit,
				'minValue' : minValue,
				'maxValue' : maxValue,
				'inputFormat' : inputFormat
			}
		},

		/* Wrapper for Flot Plotting to allow plotting in a hidden accordion container */
		renderPlot = function($chartDiv, data, options) {
			var $parent, $hidden, plot;

			// compensate for an ancestor with display:none
			if ($chartDiv.get(0).offsetWidth <=0 || $chartDiv.get(0).offetHeight <=0) {
				$parent = $chartDiv.parent();
				$hidden = $('<div class="facet-user-range-chart-hidden"></div>');
				$('body').append($hidden);
				$hidden.append($chartDiv);
			}

			plot = $.plot($chartDiv ,data, options);

			// if we moved it above, lets put it back
			if ($parent) {
			$parent.prepend($chartDiv);
				$hidden.remove();
			}

			return plot;
		},

		//Expand any selected or completed facet groups
		//Currently used as a way to override the server side open and close
		//default facet group choices
		expandSelectedFacets = function(){
			var $allUsedFacets = $autoSubmitInputs.filter(':checked').add($rangeInputs.filter('[type != "checkbox"]'));
			$allUsedFacets.each(function(){
				$container = $(this).closest('div.panel-collapse');
				if($(this).val() !== '' && !$container.hasClass('in')){
					$container.collapse('show');
				}
			});
		},

		getChartDetails = function($context) {
			var $chartData = $context.children('div[data-range-chart-values]').first(),
				chartId = $chartData.attr('id'),
				chart = charts[chartId],
				bucketSize = $chartData.data('bucket-val'),
				isDiscrete = (bucketSize === 1);

			return {
				'chartId' : chartId,
				'chart' : chart,
				'bucketSize' : bucketSize,
				'isDiscrete' : isDiscrete
			}
		},

		updateSelectionRange = function($context) {
			var rangeData = getRangeDetails($context),
				chartData = getChartDetails($context),
				chart = chartData.chart,
				isDiscrete = chartData.isDiscrete,
				newMinValue = Math.max(rangeData.minValue, rangeData.minLimit) - (isDiscrete ? 0.5 : 0.0),
				newMaxValue = Math.min(rangeData.maxValue, rangeData.maxLimit) + (isDiscrete ? 0.5 : 0.0);

			chart.setSelection({ xaxis: { from1: chart.getXAxes()[0].min, to1: newMinValue, from2: newMaxValue, to2: chart.getXAxes()[0].max }});
		},

		// Display Range Sliders within a user-range-facet context
		initRangeSliders = function () {
			$('.facet-user-range-input-slider').each(function () {
				var $dataContext = $(this).parent(),
					rangeData = getRangeDetails($dataContext),
					chartData = getChartDetails($dataContext),
					origMinValue = rangeData.$minInput.val(),
					origMaxValue = rangeData.$maxInput.val(),
					chart = chartData.chart,
					Link = $.noUiSlider.Link
					;

				var sliderOptions = {
						behaviour: 'extend-tap',
						connect : true,
						range: {
							'min': rangeData.minLimit,
							'max': rangeData.maxLimit
						},
						start: [ rangeData.minValue, rangeData.maxValue ],
						step: 1,
						serialization: {
							lower: [
								new Link({
									target: rangeData.$minInput
								}),
								new Link({
									target: function( val ) {
										updateSelectionRange($dataContext);
									}
								})
							],
							upper: [
								new Link({
									target: rangeData.$maxInput
								}),
								new Link({
									target: function( val ) {
										updateSelectionRange($dataContext);
									}
								})
							]
						}
					}
				;

				// UIslider runs its own reverse formatter (BEFORE the serialization.format.decode call) to get the raw number back to the slider, so we need to make sure it handles our input formatting
				// TODO - alternatively create a custom Link method which converts the value as it gets and sets from the input
				// TODO - we may be able to remove formatRangeInput if this formatter does all the work.
				switch (rangeData.inputFormat) {
					case 'currency':
						sliderOptions.serialization.format = {
							thousand: ',',
							prefix: '$',
							decimals: 0
							};
						break;
					default:
						sliderOptions.serialization.format = {
							decimals: 0
							};
						break;
				}

				if (chart && (sliderOptions.range.min != sliderOptions.range.max)) {
					var hasGo = false;
					// Create Slider and Bind Slider Events
					$(this).noUiSlider(sliderOptions)
					.on('slide change set', function (e) {
						var $this = $(this),
							$facet = $this.parents('.facet-type-user-range'),
							rangeSelector = $facet.find('.facet-user-range-submit-values');

						if (!hasGo) {
							addFacetGoButton(this);
							hasGo = true;
						}

						refreshRangeInputValues(rangeSelector);
					});

					rangeData.$minInput.val(origMinValue);
					rangeData.$maxInput.val(origMaxValue);
				}
			});
		},

		saveFacetCollapsedState = function () {
			//Save the list of all collapsed facets into a pipe delimited cookie string
			var collapsedFacets = [],
				cookieValue = '';
			$('div[data-facet-id]:not(.in)').each(function(){
				collapsedFacets.push($(this).data('facet-id'));
			});
			//Either clear the cookie or add some values
			if(collapsedFacets.length > 0){
				cookieValue = collapsedFacets.join('|');
			}
			$.cookie('DDC.facetState', cookieValue);
		},

		toggleAccordionIcon = function (accordionEl, isOpen) {
			var $accordionToggle = $(accordionEl).find('.facetmulti-collapse-toggle'),
				$accordionIcon = $accordionToggle.find('.ddc-icon, .ui-icon'),
				expandIconClass = $accordionToggle.data('expand-icon-class'),
				collapseIconClass = $accordionToggle.data('collapse-icon-class')
			;

			if (isOpen) {
				$accordionIcon.removeClass(expandIconClass).addClass(collapseIconClass);
			} else {
				$accordionIcon.removeClass(collapseIconClass).addClass(expandIconClass);
			}
		},

		positionAnchor = function ( e ) {
			var params = DDC.getUrlParams(),
				lastFacetInteracted = params.lastFacetInteracted,
				$anchor = $('#' + lastFacetInteracted),
				lastClick = $.cookie('DDC.facetmulti.lastClick'),
				lastClickArray = [],
				lastClickOffset = {x: 0, y: 0},
				anchorOffset,
				targetOffset
				;

			if (lastClick) {
				lastClickArray = lastClick.split(',');
				lastClickOffset.x = Number(lastClickArray[0]);
				lastClickOffset.y = Number(lastClickArray[1]);
			}

			if ($anchor.length > 0) {
				$anchor.show();
				anchorOffset = $anchor.offset();
				targetOffset = anchorOffset.top - lastClickOffset.y;

				$('html, body').scrollTop(targetOffset);
				//prevent the browser scrolling to the anchor by hiding it
				$anchor.hide();
			}
		},

		useSEOURL = function(formFields, enableSEOURLs, pageName) {
			var inventoryPages = ['INVENTORY_LISTING_DEFAULT_AUTO_NEW', 'INVENTORY_LISTING_DEFAULT_AUTO_USED', 'INVENTORY_LISTING_DEFAULT_AUTO_CERTIFIED_USED'];

			if(enableSEOURLs && inventoryPages.indexOf(pageName) > -1 &&
				((formFields.checkedMakes.length === 1 && formFields.checkedModels.length <= 1) || (formFields.selectedMake.length === 1 && formFields.selectedModel.length <= 1 && formFields.selectedMake.val()))
			) {
				return true;
			}

			return false;
		},

		getSEOURLAction = function(formFields, pageName, $canonical) {
			var baseUrl = '',
				baseUrlMatch,
				baseSEOUrlRegEx = /inventory\/(new|used|certified-preowned)/,
				inventoryType = '',
				actionParams = '',
				make = '',
				model = '',
				linkParser = document.createElement('a'),
				finalUrl = '';

			linkParser.href = $canonical[0].href;
			baseUrlMatch = baseSEOUrlRegEx.exec(linkParser.pathname);

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

			if(formFields.checkedMakes.length){
				make = getSEOFriendlyString(formFields.checkedMakes.val());
				actionParams += make;
			} else if(formFields.selectedMake.length){
				make = getSEOFriendlyString(formFields.selectedMake.val());
				actionParams += make;
			}

			if(formFields.checkedModels.length){
				model = getSEOFriendlyString(formFields.checkedModels.val());
				actionParams += "-" + model;
			} else if(formFields.selectedModel.length && formFields.selectedModel.val()){
				model = getSEOFriendlyString(formFields.selectedModel.val());
				actionParams += "-" + model;
			}

			finalUrl = baseUrl + '/' + actionParams + '/';
			return finalUrl;
		},

		getSEOFriendlyString = function(str) {
			var spaceRegEx = /(\s|%20)+/g,
				ampRegEx = /(&|%26)+/g,
				forwardSlashRegEx = /(\/|%2F)+/g,
				hyphenRegEx = /-+/g,
				singleTickRegEx = /('|%27)+/g,
				doubleTickRegEx = /("|%22)+/g;

			str = str.replace(spaceRegEx, '+')
				.replace(hyphenRegEx, '--')
				.replace(ampRegEx, '---')
				.replace(forwardSlashRegEx, '++')
				.replace(singleTickRegEx, '~')
				.replace(doubleTickRegEx, '~~');

			return str;
		},

		updateBreadCrumbAction = function() {
			// If bread crumbs are updated, change breadcrumb form action
			// to SEO url if applicable (one make, one model)
			var formFields = {},
				dataLayer = DDC.dataLayer,
				enableSEOURLs = dataLayer && dataLayer.site && dataLayer.site.features && dataLayer.site.features.enableSEOURLs,
				currentPageName = dataLayer && dataLayer.page && dataLayer.page.pageInfo && dataLayer.page.pageInfo.pageName,
				$canonical = $('link[rel="canonical"]');

			formFields.checkedMakes = $breadcrumbForm.find('.checkbox[name="make"]:checked');
			formFields.checkedModels = $breadcrumbForm.find('.checkbox[name="model"]:checked');
			formFields.selectedMake = $breadcrumbForm.find('.radio[name="make"]:checked');
			formFields.selectedModel = $breadcrumbForm.find('.radio[name="model"]:checked');

			if(useSEOURL(formFields, enableSEOURLs, currentPageName)){
				var seoActionUrl = getSEOURLAction(formFields, currentPageName, $canonical);
				if(seoActionUrl) {
					$breadcrumbForm.attr('action', seoActionUrl);
				}
			}
		},

		initEvents = function () {
			//See if the facet save param is in the URL
			var params = DDC.getUrlParams();
			if(!params.saveFacetState){  //If it's not there
				//Clear out the current facet state cookie
				$.cookie('DDC.facetState', null);
				//open any facet groups where there is a facet selected, overriding value set on the server
				expandSelectedFacets();
			}

			if ($('.facet-anchor').length > 0) {
				$(document).on('click', '.facetmulti', function (e) {
					var windowClickX = e.pageX - $(window).scrollLeft(),
						windowClickY = e.pageY - $(window).scrollTop();
					$.cookie('DDC.facetmulti.lastClick', windowClickX + ',' + windowClickY);
				});
			}

			//Handle the accordion hide and show events
			$('body').on('shown.bs.collapse hidden.bs.collapse', function(){
				saveFacetCollapsedState();
			});

			$('body').on('shown.bs.collapse', '.facetlist', function () {
				toggleAccordionIcon(this, true);
			});

			$('body').on('hidden.bs.collapse', '.facetlist', function () {
				toggleAccordionIcon(this, false);
			});

			// SORT-BY SELECT CHANGE
			$('.vlp-refine-sort-by select').on('change', function () {
				$(document).trigger('trackEvent', [{
					widgetName: 'facetmulti',
					eventName: 'change',
					data: "Sort by " + $(this).find(":selected").text()
				}]);
				window.location = $(this).val();
			});

			// Pagination GA tracking
			$paginationLinks.on('click', function (e) {
				$(document).trigger('trackEvent', [{
					widgetName: 'facetmulti',
					eventName: 'click',
					data: 'Pagination: ' + $(this).text(),
					value: parseInt($(".ddc-pagination-current-page:first").text(), 10)
				}]);
			});

			/* Auto-submit inputs */
			$autoSubmitInputs.on('change', function (e) {
				var formFields = {},
					dataLayer = DDC.dataLayer,
					enableSEOURLs = dataLayer && dataLayer.site && dataLayer.site.features && dataLayer.site.features.enableSEOURLs,
					currentPageName = dataLayer && dataLayer.page && dataLayer.page.pageInfo && dataLayer.page.pageInfo.pageName,
					$canonical = $('link[rel="canonical"]');

				$checkedSiblings = $(this).parents(".facetlist").find(":checked");
				if ($checkedSiblings.length > 1) {
					var data = "Multi-select " + ($(this).is(':checked') ? "selected" : "unselected");
					$(document).trigger('trackEvent', [{
						widgetName: 'facetmulti',
						eventName: 'click',
						data: data,
						value: $checkedSiblings.length
					}]);
				}

				$('.last-facet-interacted').val($(this).closest('.facetmulti-item').find('.facet-anchor').attr('id'));

				// If smart SEOs is enabled, and this can be an SEO-friendly URL
				// set the action to SEO-friendly
				formFields.checkedMakes = $form.find('.checkbox[name="make"]:checked');
				formFields.checkedModels = $form.find('.checkbox[name="model"]:checked');
				formFields.selectedMake = $form.find('.radio[name="make"]:checked');
				formFields.selectedModel = $form.find('.radio[name="model"]:checked');

				if(useSEOURL(formFields, enableSEOURLs, currentPageName)){
					var seoActionUrl = getSEOURLAction(formFields, currentPageName, $canonical);
					if(seoActionUrl) {
						$form.attr('action', seoActionUrl);
					}
				}

				$form.submit();
			});

		/* User Range Inputs - show 'Go' button triggers */
			$rangeInputs.on('keyup', function (e) {
				var showGo = true,
					hasGo = false,
					$siblingRangeInputs = $(this).parents('.facet-user-range').find('.facet-user-range-input').not(e.currentTarget);

				// only show button if neighbor is valid
				$siblingRangeInputs.each(function (i) {
					var errors = $(this).data('messages');
					if (errors && errors.length > 0) {
						showGo = false;
					}
				});

				// validator will remove if this is not valid
				if (showGo & !hasGo) {
					addFacetGoButton(this);
					hasGo = true;
				}
			});

			/* User Range Inputs - show 'Go' button and formatting triggers */
			$rangeInputs.on('change', function (e) {
				var $this = $(this),
					hasGo = false,
					$facet = $this.parents('.facet-type-user-range'),
					rangeSelector = $facet.find('.facet-user-range-submit-values');

				if (!hasGo) {
					addFacetGoButton(this);
					hasGo = true;
				}

				refreshRangeInputValues(rangeSelector);

				// Highlight changed values for a short while
				$this.addClass('facet-user-range-changed');
				setTimeout(
					function () {
						$this.removeClass('facet-user-range-changed');
					}, 1000);
			});

			$paymentTypeSelectors.on('change', function (e) {
				var selectedPanel = $(this).val();

				$paymentTypePanels.each(function() {
					$this = $(this)

					if($this.hasClass(selectedPanel)) {
						$this.find(':input').prop('disabled', false);
						$this.show();
					} else {
						$this.hide();
						$this.find(':input').prop('disabled', true);
					}
				});
			});

			$form.on('submit', function (e) {
				var validator = $form.data("validator"),
					$invalidInputs,
					invalidFacetTitle,
					$errors,
					$globalError,
					globalMessage,
					trackerdata;

				if (validator) {
					if (validator.checkValidity()) {
						$.publish("/facets/search");
					} else {
						// display global error, if needed
						// this will only show on SECOND user submit click, since the first is caught by onchange validation
						// which prevents an over-aggressive global error
						$invalidInputs = $('input.invalid');
						$errors = $('.facet-user-range-input-error').not('.facet-user-range-global-error, .hide');
						globalMessage = '';
						if (DDC.hasOwnProperty('i18n')) {
							globalMessage = DDC.i18n.getLabel('PLEASE_FIX_HIGHLIGHTED_FIELDS');
						}
						// Clone any error as the template for the global error container
						$globalError = $errors.eq(0).clone().append($('<small>')).text(globalMessage).append($('<ul>'));
						$globalError.addClass('facet-user-range-global-error');
						// Populate with references to invalid facets
						$errors.each(function (i) {
							invalidFacetTitle = $(this).parents('.facetlist').find('h1').text();
							$globalError.append($('<li>').text(invalidFacetTitle));
						});

						$('.facet-user-range-go-button').replaceWith($globalError);

						$(document).trigger('trackEvent', [{
							widgetName: 'facetmulti',
							eventName: 'submit',
							data: "Invalid form"
						}]);

						e.preventDefault();
						return false;
					}
				} else {
					$.publish("/facets/search");
				}

				// Track which button was used for successful form submission
				// Autosubmit fields are captured elsewhere
				trackerdata = $("[type=submit]:focus").text();
				if (trackerdata != "") {
					trackerdata = "Button: " + trackerdata;
					$(document).trigger('trackEvent', [{
						widgetName: 'facetmulti',
						eventName: 'submit',
						data: trackerdata
					}]);
				}
			});
		};


	/* Init */
	$(document).ready(function () {
		// cache the loading graphic by cycling the indicator before the onsubmit handler
		// otherwise, the css image never gets loaded
		// also this prevents interaction before form is ready
		disableFacetControls($form);
		initSubscriptions();
		initHistogramCharts();
		initRangeSliders();
		initEvents();
		enableFacetControls($form);

		if (window.location.href.indexOf('lastFacetInteracted') > 0) {
			positionAnchor();
		}

		formatRangePlaceholders('.facet-user-range-input');
		// refreshRangeInputValues() also should run, but since we do a form reset below, we do it after that is complete

		$paymentTypePanels.filter('.hide').find(':input').prop('disabled', true);

		// browser caches the form state (which can lead to mismatched inputs and results in IE8 & 9)
		setTimeout(
			function() {
				$('.facetmulti-form').each(function() {
					if ('reset' in this) {
						this.reset();
						refreshRangeInputValues('.facet-user-range-submit-values');
					}
				});
			}, 10);
	});

	// expose testable functions to test harness:
	DDC.Widgets.v9.inventoryListing.v2.isTesting = typeof(__karma__) !== 'undefined';

	if(DDC.Widgets.v9.inventoryListing.v2.isTesting){
		DDC.Widgets.v9.inventoryListing.v2.testMethods = {
			getSEOFriendlyString: getSEOFriendlyString,
			useSEOURL: useSEOURL,
			getSEOURLAction: getSEOURLAction
		}
	}

}(jQuery, window.DDC));


/*
  ********************************************************************************
	FACET BREADCRUMB COMPONENT.JS

	PUBLISHES:
	/facet/search
	/facets/breadcrumbs/change

	SUBSCRIBES:
	/facet/search
  ********************************************************************************
*/
(function ($, DDC) {
	var $form = $('.facet-breadcrumb-form'),
		$fields = $('.facet-breadcrumb-field'),
		$reset = $('.facet-breadcrumb-reset'),

		disableFacetControls = function () {
			$form.addClass('disabled');
			$fields.each(function (i, el) {
				var $el = $(el);
				var elname = $el.attr('name');
				// make duplicate of inputs for visual substitution (don't actually disable real inputs)
				var fake = $el.clone().attr('name', elname + 'fake').prop('disabled', true);
				$el.hide();
				$el.after(fake);
			});
		},

		/**
		 * Use jquery-ui icons to help style radio buttons as (X) close links
		 */
		initIcons = function () {
			$fields.after('<span class="facet-breadcrumb-close-icon"></span>');
		},

		initSubscriptions = function () {
			$.subscribe('/facets/search', disableFacetControls);
		},

		initEvents = function () {
			$fields.on('change', function (e) {
				// let facet logic update breadcrumb form action if necessary for SEO
				$.publish('/facets/breadcrumbs/change');

				$form.submit();
				$(document).trigger('trackEvent', [{
					widgetName: 'facetmulti',
					eventName: 'click',
					data: 'Breadcrumb remove'
				}]);
			});

			$form.on('submit', function (e) {
				$.publish("/facets/search");
			});

			$reset.on('click', function (e) {
				$.publish("/facets/search");
				$(document).trigger('trackEvent', [{
					widgetName: 'facetmulti',
					eventName: 'click',
					data: 'Breadcrumb reset'
				}]);
			});
		};

	/* Init */
	$(document).ready(function () {
		initIcons();
		initSubscriptions();
		initEvents();
	});

}(jQuery, window.DDC));


/*
  ********************************************************************************
	PRICING POP-OVER
  ********************************************************************************
*/
(function ($, DDC) {
	var $paymentLoanDisclaimer = $('script#payment-disclaimer-loan-verbiage'),
		$paymentLeaseDisclaimer = $('script#payment-disclaimer-lease-verbiage'),
		$paymentVLPDisclaimerVerbiage = $('script#payment-disclaimer-vlp-verbiage'),

		//Generates the popover for the payment disclaimers using data attributes and underscore templated message
		//KHAN-256: added popover support for search facet payment disclaimers and Reserve It Now
		initPaymentDisclaimer = function () {
			if ($.fn.popover) {
				//listing item payment disclaimer popover
				$('span[data-id="payment_info_trigger"]').on('click',function(e){
					// don't allow it to forward to VDP
					e.stopPropagation();
				}).popover({	//generate the popover with the custom content function for each vehicle
					html: true,
					trigger: 'hover',
					placement: 'left',
					container: 'body',
					content : function() {
						var $parentContainer = $(this).parent(),
							disclaimerTemplateHtml = '',
							disclaimerTemplate;

						//get the program end date into the proper format
						if ($parentContainer.data('program-end-date') !== ''){
							var dateTime = new Date($parentContainer.data('program-end-date'));
							var formattedProgramEndDate = (dateTime.getUTCMonth()+1) + "/" + dateTime.getUTCDate() + "/" + dateTime.getUTCFullYear();
						}
							//Create a data object off the hidden fields
						var paymentData = {
								downPayment: $parentContainer.data('downpayment'),
								APR: $parentContainer.data('apr'),
								term: $parentContainer.data('term'),
								leaseTerm: $parentContainer.data('lease-term'),
								leaseSecurityDeposit: $parentContainer.data('lease-security-deposit'),
								leaseDueAtSigning: $parentContainer.data('lease-due-at-signing'),
								excessMileCharge: $parentContainer.data('excess-mile-charge'),
								annualMiles: $parentContainer.data('annual-miles'),
								programEndDate: typeof(formattedProgramEndDate) != "undefined" ? 'through ' + formattedProgramEndDate : $parentContainer.data('no-lease-end-date-verbiage'),
								lenderLegalName: $parentContainer.data('lender-legal-name'),
								leaseLenderLegalName: $parentContainer.data('lease-lender-legal-name'),
								loanCreditScore: $parentContainer.data('loan-credit-score'),
								leaseCreditScore: $parentContainer.data('lease-credit-score'),
								monthlyPaymentPerThousand: $parentContainer.data('monthly-payment-per-thousand'),
								acquisitionFee: $parentContainer.data('acquisition-fee'),
								capCostTotal: $parentContainer.data('cap-cost-total'),
								capCostReduction: $parentContainer.data('cap-cost-reduction'),
								monthlyPayment: $parentContainer.data('monthly-payment'),
								totalMonthlyPayments: $parentContainer.data('total-monthly-payments')
							}
						;

						//Add in the VLP disclaimer for loan or lease
						disclaimerTemplateHtml += $paymentVLPDisclaimerVerbiage.html();

						//Add in loan disclaimer template if available
						if($paymentLoanDisclaimer.length > 0 && $parentContainer.data('loan')) {
							disclaimerTemplateHtml += $paymentLoanDisclaimer.html();
						}

						//Add in lease disclaimer template if available
						if($paymentLeaseDisclaimer.length > 0 && $parentContainer.data('lease')) {
							disclaimerTemplateHtml += $paymentLeaseDisclaimer.html();
						}

						//Compile the template
						disclaimerTemplate = _.template(disclaimerTemplateHtml);

						//render template and return the string of html
						return disclaimerTemplate(paymentData);
					}
				});
				//facet search payment disclaimer and Reserve It Now popovers
				var
					$facetMultiForm = $('form[name="facetmulti"]'),
					$searchFacetPopoverToggle = $facetMultiForm.find( '[data-toggle="popover"]'),
					$hproduct = $('.hproduct'),
					$onDepositPopover = $hproduct.find('.on-deposit-link[data-toggle="popover"]') //Reserve It Now functionality
				;

					if(typeof $searchFacetPopoverToggle.attr('data-placement') != 'undefined'){
						searchFacetPopoverTogglePlacement = $searchFacetPopoverToggle.attr('data-placement');
					}else{
						searchFacetPopoverTogglePlacement = 'top';
					}
					if(typeof $onDepositPopover.attr('data-placement') != 'undefined'){
						onDepositPopoverPlacement = $onDepositPopover.attr('data-placement');
					}else{
						onDepositPopoverPlacement = 'top';
					}

				initPopovers = function () {
					var searchFacetPopoverOptions = {
						html: 'true',
						placement: searchFacetPopoverTogglePlacement,
						trigger: 'hover'
					},
					onDepositPopoverOptions = {
						html: 'true',
						placement: onDepositPopoverPlacement,
						trigger: 'hover'
					};
					if( typeof $searchFacetPopoverToggle != 'undefined'){
						$searchFacetPopoverToggle.popover(searchFacetPopoverOptions);
					};
					if( typeof $onDepositPopover != 'undefined'){
						$onDepositPopover.popover(onDepositPopoverOptions);
					};
				}
			}
		}
	;

	/* Init */
	$(document).ready(function () {
		initPaymentDisclaimer();
		initPopovers();
	});

}(jQuery, window.DDC));

/*
  ********************************************************************************
	LEGACY V1 WIDGET JS
	Note: This widget was ported from the v1 version, to the new module pattern using some semi-automated techniques
	with the intent on making it more readable.  If developing a widget from scratch, please don't follow
	the pattern of page-level and user-level events, etc.
  ********************************************************************************
*/

(function ($, DDC) {

	// Declares names of cookies used by inventory listing.
	var cookies = {
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
	cookiePath = document.location.toString(),

	$facetBrowseForm = $('form:has([name=facetbrowse])'),
	$facetBrowseMod = $('.mod:has([name=facetbrowse]), .ddc-content:has([name=facetbrowse])'),
	$compareSubmitButton = $('#compareForm [type=submit]'),
	$compareForm = $('#compareForm'),
	$selectNotInput = $('select, :input:not([type=submit])'),
	$buttonLink = $('a[role=button]'),
	$compareSubmitLink = $('.compare-submit-link'),
	$submitButton = $('[role=button]'),
	$inventoryList = $('.inventoryList'),
	$compareReset = $compareForm.find('button[type=reset]'),
	$compareItemsIds = $('[name=itemIds]'),
	$toggles = $('.toggle a'),
	$hproduct = $('.hproduct'),
	$hide = $('.hide'),

	// Page- and user-level events.
	// Key names must correspond to key names in the handlers.page object.
	events = {
		// Page-level events have arbitrary values.
		page: {
			compareReset: 'compare-reset',
			compareUpdate: 'compare-update',
			toggle: 'toggle.view',
			constraintsToggle: 'constraints-toggle',
			photoSelect: 'photo-select',
			// ported from facetbrowse
			facetbrowseRefresh: 'facetbrowse-refresh',
			startLoading: 'start-loading',
			stopLoading: 'stop-loading'
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

	/**
	 * Enables the facetbrowse form, allowing for user interaction.
	 */
	enableForm = function (form) {
		if (form) {
			$(form).find($selectNotInput).not('.unsatisfiedDependent').removeAttr('disabled');
			$(form).find($submitButton).button('enable');
			$(form).parent().find($buttonLink).css('visibility', 'visible');
		}
	},

	/**
	 * Disables the facetbrowse form.  This is used when facetbrowse must
	 * take potentially prolonged action like an XHR request.
	 */
	disableForm = function (form) {
		if (form) {
			$(form).find($selectNotInput).attr('disabled', 'disabled');
			$(form).find($submitButton).button('disable');
			$(form).parent().find($buttonLink).css('visibility', 'hidden');
		}
	},

	//This function was formerly in the "initializations" function in v1 and was called in a 250 setTimeout
	postInit = function(){
		$facetBrowseForm.find('select').each(function () {
			if ($(this).attr('disabled')) {
				enableForm($facetBrowseForm);
				return false;
			}
		});

		setListingCookieValue();

		$(document).trigger(events.page.compareUpdate);

		$('.pricing').each(function () {
			var moveEstimate = $(this).find('.vlp-calc').attr('data-move-estimate-payment');
			if (moveEstimate == 'true') {
				$(this).find('.vlp-calc').appendTo(this);
			}
		});
	},

	initEvents = function(){
		//** page-level event handlers **//

		/**
		 * Sets inventory compare cookie to empty and unchecks any
		 * checked inventory items on the page.
		 *
		 * $(document).trigger('compare-reset');
		 */
		$(document).on(events.page.compareReset, function () {
			setCompareCookieValue([]);
			$('#compareForm :checkbox').attr('checked', false);

			$(document).trigger(events.page.compareUpdate);
			$(document).trigger('trackEvent', [{
				widgetName: 'inventory-listing',
				eventName: 'compare reset'
			}]);
		});


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
		$(document).on(events.page.compareUpdate, function (e, data) {
			var i,
				checked,
				cookieValue = getCompareCookieValue(),
				itemIds,
				inCookieList = false,
				cookieList = [];

			// if data.id corresponds to a checked inventory item on
			// the page, add it to the cookie list; otherwise remove it
			if (data && data.id) {
				checked = $('[value=' + data.id + ']', '#compareForm').is(':checked');

				if (checked) {
					// add item to compare cookie if not already
					// in list
					cookieList = cookieValue;

					for (i = 0; i < cookieList.length; i++) {
						inCookieList = (cookieList[i] === data.id) || inCookieList;
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
			$compareReset.trigger('mouseout');
			$compareSubmitButton.trigger('mouseout');

			// get compare list and convert to a comma-separated string
			itemIds = cookieList.join(',');

			// disable compare links if there are fewer than
			// 2 selected items
			if (cookieList.length < 2) {
				$compareSubmitLink.addClass('disabled');
			} else {
				$compareSubmitLink.removeClass('disabled');
			}

			// Set value of hidden field to comma-separated list of
			// selected inventory item UUIDs for comparison.
			// This value of this field is submitted to and required by
			// the inventory compare page.
			$compareItemsIds.val('').val(itemIds);

			// Remove selected class from inventory items on page.
			// These will be refreshed in a subsequent step.
			$hproduct.parents('li').removeClass('selected');

			if (cookieList.length) {
				// If compare list has any selection, enable the reset
				// button and mark selected inventory items on page.
				$compareReset.button('enable');
				$('[value=' + cookieList.join('], [value=') + ']').parents('li').addClass('selected');
			} else {
				// If compare list is 0-length,
				// disable thereset button.
				if(!$compareReset.hasClass('ie8-remove-disabled')) {
					$compareReset.button('disable');
				}
				else {
					$compareReset.addClass('ui-button-disabled ui-state-disabled');
				}
			}

			if (cookieList.length > 1) {
				// If compare list has 2 or more selections,
				// enable the compare button.
				$compareSubmitButton.button('enable');
			} else {
				// If compare list has 1 or fewer selections,
				// disabled the compare button.
				if(!$compareSubmitButton.hasClass('ie8-remove-disabled')) {
					$compareSubmitButton.button('disable');
				}
				else {
					$compareSubmitButton.addClass('ui-button-disabled ui-state-disabled');
				}
			}
		});

		/**
		 * Sets value of `cookies.view` to the selected view passed with
		 * `data.view`.  Updates classes on inventory lists to match
		 * selected view.
		 */
		$(document).on(events.page.toggle, function (e, data) {
			var viewName;

			if (data && data.view) {
				viewName = data.view;
				// remove existing view classes from inventory list
				$toggles.each(function (i, item) {
					$inventoryList.removeClass($(item).attr('data-view'));
				});
				// add selected view class to inventory list
				$inventoryList.addClass(viewName);

				// remember selected view in a cookie
				setViewCookieValue(viewName);

				$(document)
					.trigger('trackEvent', [{
						widgetName: 'inventory-listing',
						eventName: 'view type change',
						data: viewName
					}]);
				// adding event to notify when toggle is changed
				$compareForm.trigger('inventory-listing-toggle');
			}
		});

		/**
		 * Toggles visibility of a portion of the constraints listed
		 * for a facet with the given toggle link element `data.toggle`.
		 *
		 * Facet constraint lists may have a capped number
		 * of constraints.
		 *
		 * Learn more:  /v9/components/inventory-search/facetlist/v1/
		 */
		$(document).on(events.page.constraintsToggle, function (e, data) {
			var toggleModParent;

			if (data && data.toggle) {
				toggleModParent = $(data.toggle).parents('.mod, .ddc-content').eq(0);
			}

			if (toggleModParent && $(toggleModParent).find($hide).size()) {
				$(toggleModParent).find($hide).removeClass('hide');

				if (data && data.less && data.toggle) {
					$(data.toggle).html(data.less);
				}
			} else if (toggleModParent && !$(toggleModParent).find($hide).size()) {
				$(toggleModParent).find('ul').not(':first').addClass('hide');

				if (data && data.more && data.toggle) {
					$(data.toggle).html(data.more);
				}
			}
		});

		/**
		 * Sets the primary photo `src` to `data.url` if passed and
		 * triggers a `dyanmicUrls` event where
		 * `imageUrl` equals `data.url`.
		 *
		 * Learn more about dynamic URLs:
		 * /v9/documentation/js/dynamic-urls/
		 */
		$(document).on(events.page.photoSelect, function (e, data) {
			if (data && data.url) {
				$(document).trigger('dynamicUrls', [{
					imageUrl: data.url
				}]);
				$('.inventory-image-default .photo:not(.thumb)').attr('src', data.url);
			}
		});


		$(document).on(events.page.startLoading, function () {
			// blur form fields during load sequence as they
			// will be replaced anyway
			$facetBrowseForm.find($selectNotInput).blur();

			// show a loading indicator
			$('<div class="loading">&nbsp;</div>')
				.css({
					position: 'absolute',
					minWidth: '50px',
					minHeight: '50px'
				})
				.appendTo($facetBrowseForm)
				.position({
					of: $facetBrowseForm,
					my: 'center center',
					at: 'center center',
					offset: '0 -50'
				});
		});


		//** user-level 'live' event handlers **//

		/**
		 * Prevents link action from occurring when user clicks
		 * toggle links.
		 */
		$(document).off('click', '.toggle a').on('click', '.toggle a', function (e) {
			e.preventDefault();
		});

		/**
		 * Triggers a page-level `compare-reset` event.
		 */
		$(document).off('click', '#compareForm button[type=reset]').on('click', '#compareForm button[type=reset]', function () {
			$(document).trigger(events.page.compareReset);
			return false;
		});

		/**
		 * Triggers page-level `constraints-toggle` event with toggle
		 * element equal to the clicked element.
		 */
		$(document).off('click', '.constraintsToggle').on('click', '.constraintsToggle', function () {
			var data = $.extend({
				toggle: this
			}, $.getDataAttributes(this));

			$(document).trigger(events.page.constraintsToggle, [data]);
			return false;
		});

		/**
		 * Triggers page-level `photo-select` event with URL equal to
		 * the clicked element's parent anchor element's `href`.
		 */
		$(document).off('click', '.inventory-image-default .photo.thumb').on('click', '.inventory-image-default .photo.thumb', function () {
			var data = {
				url: $(this).parent('a').attr('href')
			};

			$(document).trigger(events.page.photoSelect, [data]);
			return false;
		});

		/**
		 * Ensures the Facebook dialog button click event is retriggered
		 * upon completion of the Facebook Connect login procedure to
		 * trigger any dialog which may be additionally associated with
		 * the button.
		 */
		$(document).off('click', '.facebook-connect-login.dialog').on('click', '.facebook-connect-login.dialog', function () {
			var self;

			if (!$(this).data('fb-clicked-once')) {
				self = this;

				$(document).on('facebookConnectLogin.fb-clicked-once', function () {
					$(document).off('facebookConnectLogin.fb-clicked-once');
					$(self).data('fb-clicked-once', true);
					setTimeout(function () {
						$(self).trigger('click');
					}, 150);
				});
			}
		});

		$(document).off('click', '.hproduct').on('click', '.hproduct', function (e) {
			if ($(e.target).is('a') === false && $(e.target).parent().is('a') === false && ($(e.target).is('img') === false ||
				($(e.target).is('img') && $(e.target).parent('div').parent('li').hasClass('certified')))) {
				var link = $(e.target).closest($hproduct).find('.url').attr('href');
				if (link !== "" && link !== undefined) {
					$(this).trigger('hproductClick',[e]);
					window.location = link;
					return false;
				}
			}
		});

		$(document).off('click', '.carfax').on('click', '.carfax', function (e) {
			$(document).trigger('trackEvent', {
				widgetName: 'inventory-listing',
				eventName: 'logo click',
				data: 'carfax'
			});
		});

		$(document).off('click', '.mod:has([name=facetbrowse]) .refresh, .ddc-content:has([name=facetbrowse]) .refresh').on('click', '.mod:has([name=facetbrowse]) .refresh, .ddc-content:has([name=facetbrowse]) .refresh', function () {
			var data = {
				url: $(this).attr('href'),
				form: $(this)
					.parents($facetBrowseMod)
					.find($facetBrowseForm)
			};

			$(document).trigger(events.page.facetbrowseRefresh, [data]);
			return false;
		});

		//** user-level traditional event handlers **//

		/**
		 * Triggers a page-level `compare-updated` event with
		 * inventory item UUID from the current checkbox field's value.
		 */
		$('#compareForm :checkbox').on('click', function () {
			var data = {
				id: $(this).val()
			};
			$(document).trigger(events.page.compareUpdate, [data]);
		});

		/**
		 * Allows submit action if more than one inventory item is
		 * selected for comparison; otherwise cancels action.
		 */
		$('#compareForm').on('submit', function () {
			return (getCompareCookieValue().length > 1);
		});

		/**
		 * Triggers compare submission via direct DOM form
		 * submit trigger.
		 */
		$('.compare-submit-link').on('click', function (e) {
			$compareForm.trigger('submit');
			e.preventDefault();
		});

		$('form:has([name=facetbrowse]) select').on('change', function (event) {
			var form = $(this).parents($facetBrowseForm);

			// JIRA-24984: When unselecting make, also unselect model
			if ($(event.target).attr('name') === 'make' && $(event.target).attr('value') === '') {
				form.find('select[name="model"]').val('');
			}

			form.submit();
			disableForm(form);
			$(document).trigger(events.page.startLoading);
		});
	};

	//Kick the whole thing off when the DOM is ready
	$(document).ready(function(){
		initEvents();
		postInit();
	});

}(jQuery, window.DDC));
