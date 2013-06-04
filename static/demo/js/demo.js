function expandStep($nextStep) {
    $nextStep.removeClass("disabled")
        .children(".frame")
        .children(".slider").hide().end()
        .slideDown(500, function() {
            // and show the slider we hid earlier
            $(this).children(".slider").fadeIn(500, function() {
                // and finally scroll to the step
                $.scrollTo($nextStep, {
                    'axis': 'y',
                    'duration': 500,
                    'offset': { 'left':0, 'top': -20 }
                });
            });
        });
}

$(document).ready(function() {
    // process all frames and their children
    $(".frame").each(function(i, elem) {
        var $panels = $(this).find(".panel");
        var $slider = $(this).find(".slider");

        // make all the panels the width of the frame
        $panels.width($(this).innerWidth());
        // make the slider the width of the frame * number of contained subframes
        $slider.width($panels.length * $(this).innerWidth());

        // find the largest panel's height (or the frame's height if it's larger)
        var maxHeight = $(this).height();
        $panels.each(function(i, elem) {
            var $me = $(this);

            if ($me.height() > maxHeight)
                maxHeight = $me.outerHeight();

            // while we're iterating, attach click handlers
            $me.find(".controls .prev").click(function() {
                $me.closest(".frame").scrollTo($me.prev(), {
                    'axis': 'x',
                    'duration': 200
                });
            });

            $me.find(".controls .next").click(function() {
                if ($(this).hasClass("to_next_step")) {
                    // if we're past the last substep, move to the next step
                    var $nextStep = $me.closest(".step").next();
                    expandStep($nextStep);
                }
                else {
                    $me.closest(".frame").scrollTo($me.next(), {
                        'axis': 'x',
                        'duration': 200
                    });
                }
            });
        });

        // and set this frame to whatever we found
        $(this).height(maxHeight);
        // and set the panels to the maxHeight
        $panels.height(maxHeight);

        // and make the slider as tall, of course
        $slider.height($(this).innerHeight());
    });

    // attach handlers to all the step headers to expand their respective steps
    $(".step h2").css('cursor', 'pointer').click(function() {
        expandStep($(this).closest(".step"));
    })

    // and fire an event so all of our pages can customizably hide or show their frames
    $.publish("/frames/updated", []);
});