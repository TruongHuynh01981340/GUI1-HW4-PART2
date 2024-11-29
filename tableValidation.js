/*
    Name: Truong-Thinh Huynh SID: 01981340
    GitHub Username: TruongHuynh01981340
*/

// Global variable that controls the switch to tab and the id count of each tab and its content
let tabCount = 0;

$(document).ready(function() {
    $("#tableTabsDiv").tabs();

    // https://jqueryvalidation.org/jQuery.validator.addMethod/
    // jQuery validator that checks whether min is less or equal to max.
    jQuery.validator.addMethod("validateMin", function(value, element, params) {
        const minInput = parseInt(value);
        const maxInput = parseInt($(params).val());
        
        // If either is NaN, this means that this validator doesn't apply so return before the wrong error msg is displayed.
        if (isNaN(minInput) || isNaN(maxInput)) {
            return true;
        }

        return minInput <= maxInput;
    }, "Invalid Input: Please enter a number less or equal to maximum value.");

    // jQuery validator that checks whether max is greater or equal to min.
    jQuery.validator.addMethod("validateMax", function(value, element, params) {
        const minInput = parseInt($(params).val());
        const maxInput = parseInt(value);
        
        // If either is NaN, this means that this validator doesn't apply so return before the wrong error msg is displayed.
        if (isNaN(minInput) || isNaN(maxInput)) {
            return true;
        }

        return maxInput >= minInput;
    }, "Invalid Input: Please enter a number greater or equal to minimum value.");

    // Form validator that checks for a required input, if it's a number, whether it's between -50 and 50, and must be less or equal to/greater or equal to min/max.
    $("#mulForm").validate({
        rules: {
            minColVal: {
                required: true,
                number: true,
                range: [-50, 50],
                // Call custom validator that checks for min and max to see if both are valid to each other.
                validateMin: "#maxColVal"
            },
            maxColVal: {
                required: true,
                number: true,
                range: [-50, 50],
                validateMax: "#minColVal"
            },
            minRowVal: {
                required: true,
                number: true,
                range: [-50, 50],
                validateMin: "#maxRowVal"
            },
            maxRowVal: {
                required: true,
                number: true,
                range: [-50, 50],
                validateMax: "#minRowVal"
            }
        },
        // Output error msg based on the reason the validator failed.
        messages: {
            minColVal: {
                required: "Invalid Input: Please enter a number.",
                number: "Invalid Input: Please enter a number.",
                range: "Invalid Input: Please enter a number between -50 to 50."
            },
            maxColVal: {
                required: "Invalid Input: Please enter a number.",
                number: "Invalid Input: Please enter a number.",
                range: "Invalid Input: Please enter a number between -50 to 50."
            },
            minRowVal: {
                required: "Invalid Input: Please enter a number.",
                number: "Invalid Input: Please enter a number.",
                range: "Invalid Input: Please enter a number between -50 to 50."
            },
            maxRowVal: {
                required: "Invalid Input: Please enter a number.",
                number: "Invalid Input: Please enter a number.",
                range: "Invalid Input: Please enter a number between -50 to 50."
            }
        },
        // Important on placing the error msg into span rather than a default view, which will mess up the layout of the program.
        // https://www.webcodegeeks.com/javascript/jquery/jquery-errorplacement-example/
        // https://www.educba.com/jquery-validate-errorplacement/
        errorPlacement: function(error, element) {
            const span = element.attr("id") + "ErrorMsg";
            $("#" + span).html(error);
            $("#" + span).css({"color": "red"});
        },
        // Validate when Regenerate Table button is submitted. This is where the tab will be created if the input is valid.
        submitHandler: function(form) {
            const table = regenerateTable();

            if (table) {
                generateTab(table);
            }

            return false;
        }
    }),

    // Validate when the user input anything into the input
    $("#minColVal").on("input change", function() {
        $("#mulForm").validate().element($("#minColVal"));
       
        // If the input is valid, then change the slider to match the user input.
        if ($("#mulForm").validate().element($("#minColVal"))) {
            $("#minColSlider").slider("value", parseInt($("#minColVal").val()));
            // Make a new table to show the change.
            regenerateTable();
        }
    })

    $("#maxColVal").on("input change", function() {
        $("#mulForm").validate().element($("#maxColVal"));
        
        if ($("#mulForm").validate().element($("#maxColVal"))) {
            $("#maxColSlider").slider("value", parseInt($("#maxColVal").val()));
            regenerateTable();
        }
    })

    $("#minRowVal").on("input change", function() {
        $("#mulForm").validate().element($("#minRowVal"));
        
        if ($("#mulForm").validate().element($("#minRowVal"))) {
            $("#minRowSlider").slider("value", parseInt($("#minRowVal").val()));
            regenerateTable();
        }
    })

    $("#maxRowVal").on("input change", function() {
        $("#mulForm").validate().element($("#maxRowVal"));
        
        if ($("#mulForm").validate().element($("#maxRowVal"))) {
            $("#maxRowSlider").slider("value", parseInt($("#maxRowVal").val()));
            regenerateTable();
        }
    })

    // Validate the slider with it only having -50 to 50 as possible value; default is 0.
    // https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch06_SliderWidget.pdf
    // https://api.jquery.com/trigger/
    $('#minColSlider').slider({
        value: 0,
        min: -50,
        max: 50,
        // This is super important as we are changing the input value with the slider but also calling validate to make sure the value is valid.
        slide: function(e, ui) {
            $("#minColVal").val(ui.value).trigger("change");
        }
    });

    $('#maxColSlider').slider({
        value: 0,
        min: -50,
        max: 50,
        slide: function(e, ui) {
            $("#maxColVal").val(ui.value).trigger("change");
        }
    });

    $('#minRowSlider').slider({
        value: 0,
        min: -50,
        max: 50,
        slide: function(e, ui) {
            $("#minRowVal").val(ui.value).trigger("change");
        }
    });

    $('#maxRowSlider').slider({
        value: 0,
        min: -50,
        max: 50,
        slide: function(e, ui) {
            $("#maxRowVal").val(ui.value).trigger("change");
        }
    });

    // Validate input and if it's valid, then change the slider value to match with input
    // https://api.jquery.com/change/
    $("#minColSlider").on("input", function() {
        const value = parseInt($(this).val());

        if (!isNaN(value)) {
            $("#minColSlider").slider("value", value);
        }
    })

    $("#maxColSlider").on("input", function() {
        const value = parseInt($(this).val());

        if (!isNaN(value)) {
            $("#maxColSlider").slider("value", value);
        }
    })

    $("#minRowSlider").on("input", function() {
        const value = parseInt($(this).val());

        if (!isNaN(value)) {
            $("#minRowSlider").slider("value", value);
        }
    })

    $("#maxRowSlider").on("input", function() {
        const value = parseInt($(this).val());

        if (!isNaN(value)) {
            $("#maxRowSlider").slider("value", value);
        }
    })
})

// This listener waits for any class named removeTab being clicked.
$(document).on("click", ".removeTab", function() {
    // Retrieve the removeTab id which should be something like removeTab{id}
    const removeTabId = $(this).attr("id");
    // When we removed the removeTab, it should be left with {id}, which should correspond with the matching tab.
    const tabId = removeTabId.replace("removeTab", "");

    // Remove the tab 
    $(`#tab${tabId}`).remove();
    // Remove the tab content
    $(`#table${tabId}`).remove();

    // Refresh the tab to show the result
    $("#tableTabsDiv").tabs("refresh");
});

// This listener waits for id named removeAllTabsButton being clicked.
$(document).on("click", "#removeAllTabsButton", function() {
    // Get all li except the first since that's the tab where we enter our parameters.
    $("#tableTabsDiv ul li:not(:first-child)").each(function() {
        const tabId = $(this).attr("id");
        const tabContentId = tabId.replace("tab", "table");

        $(`#${tabId}`).remove();
        $(`#${tabContentId}`).remove();
    })

    $("#tableTabsDiv").tabs("refresh");
    // Switch to the first tab since everything else is deleted.
    $("#tableTabsDiv").tabs("option", "active", 0);
    // Reset the tab counter since there are no tab left.
    tabCount = 0;
});

// I had to play around with this parameters a little bit so I decided to use a structure to store
// a table, and the four parameters.
function generateTab({table, minColVal, maxColVal, minRowVal, maxRowVal}) {
    const tableNumber = `table${tabCount}`;
    const tableId = `generatedTable${tabCount}`;

    table.attr("id", tableId);

    // li is named tab{tabCount} and the span is the little x that the user can click to exit out of a program.
    $("#tableTabsDiv ul").append(
        `<li id="tab${tabCount}">
            <a href="#${tableNumber}">minCol: ${minColVal}, maxCol: ${maxColVal}, minRow: ${minRowVal}, maxRow: ${maxRowVal}</a>
            <span id="removeTab${tabCount}" class="removeTab">X</span>
        </li>`
    );

    $("#tableTabsDiv").append(`<div id="${tableNumber}"></div>`);
    // Add tab content with the table returned from regenerateTable();
    $(`#${tableNumber}`).append(table);

    $("#tableTabsDiv").tabs("refresh");
    
    // This is a workaround since a bug happened when I deleted some tabs and regenerate more. The error is
    // the tab doesn't automically navigate to the proper tab when created since the id doesn't decrease when a tab in the middle
    // is removed. So I navigated to the tab of the last element instead of based on tabCount.
    const lastTab = $("#tableTabsDiv ul li").length - 1;

    $("#tableTabsDiv").tabs("option", "active", lastTab);
    tabCount++;
}

function regenerateTable() {
    // Convert text inputs into numeric values.
    // https://api.jquery.com/val/
    var minColVal = parseInt($('#minColVal').val());
    var maxColVal = parseInt($('#maxColVal').val());
    var minRowVal = parseInt($('#minRowVal').val());
    var maxRowVal = parseInt($('#maxRowVal').val());
    
    if (isNaN(minColVal) || isNaN(maxColVal) || isNaN(minRowVal) || isNaN(maxRowVal)) {
        return;
    }

    const previousTable = $('#generatedTable');

    // If there's already a table being displayed, remove that so the new one will be display. This is 
    // not related to the tab table. Just the dynamically table on Enter Parameters tab.
    if (previousTable.length) {
        previousTable.remove();
    }

    // For debugging purposes
    // console.log(minColVal);
    // console.log(maxColVal);
    // console.log(minRowVal);
    // console.log(maxRowVal);

    // This div will be for making the table scrollable. Right now, we will add all table elements into this div.
    const tableDiv = $('#tableDiv');

    const table = $("<table id='generatedTable' class='generatedTable'></table>").css("border", "1px solid black");

    const row = $("<tr>");
    // This lone th is for making an empty spot in the first row and column of the table
    const th = $("<th>");

    // Add the th to the first row.
    row.append(th);

    // This for loop is use to make the header that display the min to max to the first row.
    // Very important source: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces
    for (let i = minColVal; i <= maxColVal; i++) {
        const th = $("<th>");
        th.text(i);
        row.append(th);
    }

    // Add it to the table.
    table.append(row);

    // This nested for loops is to generate the rest of the table.
    for (let i = minRowVal; i <= maxRowVal; i++) {
        const row = $("<tr>");
        const th = $("<th>");
        th.text(i);
        row.append(th);

        for (let j = minColVal; j <= maxColVal; j++) {
            const td = $("<td>");
            td.text(i * j);
            row.append(td);
        }

        table.append(row);
    }

    tableDiv.append(table);

    // Workaround on returning multiple variables since I needed the table for the tab content, BUT also
    // the tab header which needs the value of each parameters to be displayed.
    return {table, minColVal, maxColVal, minRowVal, maxRowVal};
}   