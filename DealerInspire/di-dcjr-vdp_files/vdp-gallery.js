/////////////////////////////////////////////
/// Owl Carousels for image gallery
/////////////////////////////////////////////

jQuery(document).ready(function($) {
    var mainGallery = $("#gallery-carousel"),
        thumbStrips = $(".gallerycarousel-thumbs"),
        navArrows = ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        lightboxLink = $('.gallery-lightbox-link').hide(),
        viewLargerLink = $('.view-larger-version').hide(),
        lightboxContent = $('#gallery-lightbox-content'),
        lightboxMainGallery = $('#gallery-lightbox'),
        lightboxThumbGallery = $('.gallery-lightbox-thumbs'),
        numImages = $(mainGallery).find('img').length,
        mainOptions = {
            singleItem: true,
            slideSpeed: 300,
            navigation: true,
            navigationText: navArrows,
            pagination: false,
            responsiveRefreshRate: 200,
            lazyLoad: true,
            lazyFollow: false,
            afterMove: function(el) {
                if (el.data('owlCarousel').currentItem > 0) {
                    $(el).tooltip('destroy'); // hide and remove tooltip
                }
            },
            afterUpdate: function(el) {
                setItemHeight(el);
            }
        },
        thumbOptions = {
            items: 4,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [979, 3],
            itemsTablet: [768, 3],
            itemsMobile: [479, 3],
            navigation: true,
            navigationText: navArrows,
            pagination: false,
            responsiveRefreshRate: 100,
            lazyLoad: true,
            scrollPerPage: true,
            afterUpdate: function(el) {
                setItemHeight(el);
            }
        },
        isIE8 = $('html').hasClass('ie8');

    // Init the carousels with Owl
    function initMainGalleries() {
        // set some additional options
        var mainConfig = mainOptions,
            thumbConfig = thumbOptions;

        // reset some configuration options for the carousels
        mainConfig.afterAction = function (el) {
            syncPosition(this.currentItem, thumbStrips);
        };
        mainConfig.afterInit = function (el) {
            setItemHeight(el);

            if (numImages > 1) {
                displayTooltip();
            }

            $(document).trigger('di_vdp_gallery_init', el);
        };
        thumbConfig.afterInit = function (el) {
            thumbsInit(el, mainGallery, thumbStrips);
        };

        // construct main carousels
        $(mainGallery).owlCarousel(mainConfig);
        $(thumbStrips).each(function(index) {
            $(this).owlCarousel(thumbConfig);
        });

        // new UnityWorks method with UnityWorks video in Gallery lightbox
        $('#gallery-carousel .dealer-video-trigger').on('click', function(e){
            return false;
        });            

    }

    function initLightboxGalleries () {
        // Grab main carousel options
        var mainConfig = mainOptions,
            thumbConfig = thumbOptions;

        // Reset some config options for the carousels
        mainConfig.afterAction = function (el) {
            syncPosition(this.currentItem, lightboxThumbGallery);
        };
        mainConfig.afterInit = function(el) {
            setItemHeight(el);
        };
        thumbConfig.afterInit = function (el) {
            thumbsInit(el, lightboxMainGallery, lightboxThumbGallery);
        };

        // Clone and initialize galleries
        cloneMainGallery(function () {
            $(lightboxMainGallery).owlCarousel(mainConfig);
        });
        cloneThumbGallery(function () {
            $(lightboxThumbGallery).owlCarousel(thumbConfig);
        });
    }

    // show a tooltip on on main gallery on mobile
    function displayTooltip() {
        if ($(window).width() < 768 && isMobile.any()) {
            $(mainGallery).tooltip({
                placement: 'top',
                title: 'Swipe to see more photos...',
                container: $(mainGallery)
            });

            $(mainGallery).tooltip('show');
        }
    }

    // houses the afterInit actions for thumbnails
    function thumbsInit(el, gallery, thumbs) {
        el.find(".owl-item").eq(0).addClass("synced");
        setItemHeight(el);
        addThumbClickListeners(gallery, thumbs);    
    }

    // Sync the position of the thumbnail sliders and the main gallery
    function syncPosition(current, thumbs) {
        $(thumbs).each(function(index) {
            var that = $(this);

            $(that)
                .find(".owl-item")
                .removeClass("synced")
                .eq(current)
                .addClass("synced");

            if ($(that).data("owlCarousel") !== undefined) {
                center(that, current);
            }
        });
    }

    // adding click enve listeners for the thumbnail strips
    function addThumbClickListeners(gallery, thumbs) {
        $(thumbs).on("click", ".owl-item", function(e) {
            e.preventDefault();
            var number = $(this).data("owlItem");
            $(gallery).data('owlCarousel').goTo(number);
        });
    }

    // Center the current thumbnail if possible
    function center(gallery, number) {
        var sync2visible = gallery.data("owlCarousel").owl.visibleItems;
        var num = number;
        var found = false;

        for (var i in sync2visible) {
            if (num === sync2visible[i]) {
                var found = true;
            }
        }

        if (found === false) {
            if (num > sync2visible[sync2visible.length - 1]) {
                gallery.trigger("owl.goTo", num - sync2visible.length + 2);
            } else {
                if (num - 1 === -1) {
                    num = 0;
                }
                gallery.trigger("owl.goTo", num);
            }
        } else if (num === sync2visible[sync2visible.length - 1]) {
            gallery.trigger("owl.goTo", sync2visible[1]);
        } else if (num === sync2visible[0]) {
            gallery.trigger("owl.goTo", num - 1);
        }
    }

    // Set the image height of owl-items equal to first image height 
    // (makes positioning of controls and loading indicator easier)
    function setItemHeight(el) {
        var firstImage = el.find(".owl-item img").eq(0);

        if($(firstImage).get(0).complete) {
            var firstImageHeight = $(firstImage).outerHeight();
            el.find('.owl-item').height(firstImageHeight); 
        } else {
            setTimeout(function() {
                setItemHeight(el);
            }, 1000);
        }
    }

    // Add images from the main gallery to the lightbox container
    function cloneMainGallery (callback) {
        // Grab the lightbox images from the main gallery
        var lightboxMainItems = $(mainGallery)
            .find('.item')
            .clone();

        // Append images to main gallery in lightbox
        $(lightboxMainItems).appendTo(lightboxMainGallery);

        if (callback) {
            callback();
        }
    }

    // Add images from the main thumbnail carousel to the lightbox container
    function cloneThumbGallery (callback) {
        // Grab the lightbox images from the main thumbs
        var lightboxThumbItems = $(thumbStrips)
            .first()
            .find('.item')
            .clone();

        // Append images to thumb carousel in lightbox
        $(lightboxThumbItems).appendTo(lightboxThumbGallery);

        if (callback) {
            callback();
        }
    }

    // Add click event for the gallery lightbox
    function initLightboxEvents() {
        if (typeof $.fn.fancybox == "function") {
            var currentItem = false,
                src = '',
                isDesktopWindow = $(window).width() > 767 ? true : false;

            // Add gallery images to lightbox container
            if (numImages > 1 && $(mainGallery).data("owlCarousel") !== undefined) {
              initLightboxGalleries();

              if (isDesktopWindow === true) {
                $(lightboxLink).show();
  
                // Add click event for the lightbox link
                $(lightboxLink).on('click', function () {
                    currentItem = $(mainGallery).data('owlCarousel').currentItem;
                    triggerLightboxOpen(currentItem);
                });
              }
            }
            
            if (isDesktopWindow === true) {
                $(viewLargerLink).show();
            }

            // clicks on main gallery images open the lightbox
            $(mainGallery).on('click', '.owl-item', function (e) {
                e.preventDefault();
                
                if (numImages > 1 && $(mainGallery).data("owlCarousel") !== undefined) {
                  currentItem = $(mainGallery).data('owlCarousel').currentItem;
                }

                if ($(window).width() > 767) {
                    triggerLightboxOpen(currentItem);
                }
            });
        } else {
            console.log("Gallery: cannot find Fancybox.");
        }
    }

    function repositionLightbox () {
        window.jQuery.fancybox.reposition();
    }

    function triggerLightboxOpen (target) {
        var fancyContent = '';
      
        if ($(lightboxContent) !== undefined && $(lightboxContent).length > 0) {
            fancyContent = '#gallery-lightbox-content';
        } else {
            fancyContent = $(mainGallery).find('img').first().clone();
        }
      
        var options = {
            fitToView: true,
            maxWidth: '77%',
            minHeight: 'auto',
            height: 'auto',
            scrolling: true,
            padding: 10,
            scrollOutside: false,
            closeClick: false,
            aspectRatio: true,
            modal: true,
            type: 'inline',
            content: jQuery(fancyContent),
            autoSize: true,
            tpl: {
                wrap: '<div class="fancybox-wrap fancybox-vdp-gallery" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>'
            },
            beforeShow: function () {
                $('.fancybox-skin').append('<a title="Close" class="fancybox-item fancybox-close" href="javascript:jQuery.fancybox.close();"></a>');
            },
            afterShow: function () {
                // if a goto item is specified and carousels exist, go to it.
                if (target !== false && $(mainGallery).data("owlCarousel") !== undefined) {
                    $(lightboxMainGallery, lightboxThumbGallery)
                        .data('owlCarousel')
                        .goTo(target);
                }
            }
        };

        //$.fancybox.open(options);
		DealerInspireLightbox.open(options);
    }

    // fire up the main galleries
    initMainGalleries();

    // Initialize the lightbox gallery
    initLightboxEvents();
}(jQuery));