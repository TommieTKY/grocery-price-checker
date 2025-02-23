jQuery(window).on("load", function () {
  // Sorts the rows in the table by the Price/unit (last column) in ascending order.
  function sortTable(tbodyId) {
    var rows = $("#" + tbodyId + " tr").get();

    rows.sort(function (a, b) {
      var priceA = parseFloat($(a).find("td:last-child").text());
      var priceB = parseFloat($(b).find("td:last-child").text());
      return priceA - priceB;
    });

    $("#" + tbodyId).append(rows);
  }

  // Populates itemArray with all grocery items and adds them as options in the datalist for the search input.
  var divitem = "";
  var itemArray = [];
  $(".sitem").each(function () {
    itemArray.push($(this).text());
  });

  $.each(itemArray, function (index, value) {
    $("#itemList").append("<option value=" + value + ">");
  });

  // Handles search button click: validates input, displays the corresponding table, and sorts it.
  $("#searchButton").on("click", function () {
    divitem = $("#searchOption").val();
    if (itemArray.includes(divitem)) {
      $("#searchOption").css("border", "3px solid #B07B00");
      $(".content").hide();
      $("table").show();
      $("form").show();

      $("h1").html(divitem);
      $("#" + divitem).show();

      sortTable(divitem);
    } else {
      $("#searchOption").focus().css("border", "3px solid red");
    }
  });

  // Handles click on a grocery item: shows relevant table and form, adjusts labels, and sorts the table.
  $(".sitem").on("click", function () {
    $(".content").hide();
    $("table").show();
    $("form").show();

    divitem = $(this).text();
    $("h1").html(divitem);
    $("#" + divitem).show();

    if (
      divitem === "veg" ||
      divitem === "fruits" ||
      $(this).closest("li").attr("id") === "hmeat" ||
      $(this).closest("li").attr("id") === "hstarch"
    ) {
      $("label[for='unit']").text("Unit (lb)");
    } else {
      $("label[for='unit']").text("Unit");
    }

    sortTable(divitem);
  });

  // Displaying prompts for the buttons when hovered over
  $("#cal").hover(
    function () {
      // Mouse enters
      $("#prompt").text("Calculate the price per unit.");
    },
    function () {
      // Mouse leaves
      $("#prompt").text("");
    }
  );

  $("#add").hover(
    function () {
      $("#prompt").text("Add the new record to the table.");
    },
    function () {
      $("#prompt").text("");
    }
  );

  $("#edit").hover(
    function () {
      $("#prompt").text("Delete the records of the table.");
    },
    function () {
      $("#prompt").text("");
    }
  );

  // Calculates the price per unit and provides feedback on whether the item is worth buying.
  var puLargest = "";
  $("#cal").on("click", function () {
    var price = $("#price").val();
    var unit = $("#unit").val();
    if (!price) {
      $("#price").focus().css("outline", "2px solid red");
    } else if (!unit) {
      $("#unit").focus().css("outline", "2px solid red");
    } else {
      var puCal = (price / unit).toFixed(3);
      $("#pu").val(puCal);
      $("#cal").siblings("p").remove();
      $("#price").css("outline", "none");
      $("#unit").css("outline", "none");

      puLargest = parseFloat($("#" + divitem + " tr:last td:last").text());
      if (puCal < puLargest || puCal == puLargest) {
        $("#cal").after(
          `<p style="display:inline; margin-left: 5px">Buy it!</p>`
        );
      } else {
        $("#cal").after(
          `<p style="display:inline; margin-left: 5px">Don't buy!</p>`
        );
      }
    }
    return false;
  });

  // Adds a new row to the table if inputs are valid and the price/unit is worth adding.
  $("#add").on("click", function () {
    var store = $("#store").val();
    var price = $("#price").val();
    var unit = $("#unit").val();
    var pu = $("#pu").val();
    puLargest = parseFloat($("#" + divitem + " tr:last td:last").text());
    $("#add").siblings("p").remove();
    if (!store || !price || !unit || !pu) {
      if (!store) {
        $("#store").focus().css("outline", "2px solid red");
      } else if (!price) {
        $("#price").focus().css("outline", "2px solid red");
      } else if (!unit) {
        $("#unit").focus().css("outline", "2px solid red");
      } else if (!pu) {
        $("#pu").focus().css("outline", "2px solid red");
      }
    } else if (pu != (price / unit).toFixed(3)) {
      $("#add").after(
        `<p style="display:inline; margin-left: 5px">Please calculate the Price/unit again!</p>`
      );
    } else if (pu > puLargest) {
      $("#add").after(
        `<p style="display:inline; margin-left: 5px">Not worth adding!</p>`
      );
    } else {
      var newRow = `
      <tr>
        <td>${store}</td>
        <td>${price}</td>
        <td>${unit}</td>
        <td>${pu}</td>
      </tr>`;
      $("#" + divitem).append(newRow);
      sortTable(divitem);
      $("#store").css("outline", "none").val("");
      $("#price").css("outline", "none").val("");
      $("#unit").css("outline", "none").val("");
      $("#pu").css("outline", "none").val("");
    }
    return false;
  });

  // Enables table row editing: adds delete buttons and confirm/cancel actions.
  $("#edit").on("click", function () {
    if ($("thead tr th:contains('Confirm')").length === 0) {
      $("thead tr").append(`<th><button id="confirm">Confirm</button></th>`);

      $("#" + divitem + " tr").append(
        `<td><button class="del" style="background-color:#FFB60D">Delete</button></td>`
      );

      $("#edit").after(
        `<button id="cancel" style="margin-left: 5px">Cancel</button>`
      );
    }

    $("#add").prop("disabled", true);
    $("#cal").prop("disabled", true);
    $("#edit").prop("disabled", true);

    var itemDeleted = [];
    $("#" + divitem).on("click", ".del", function () {
      itemDeleted.push($(this).closest("tr"));
      $(this).closest("tr").remove();
    });

    // Displaying prompts for the buttons when hovered over
    $("#confirm").hover(
      function () {
        $("#prompt").text("Confirm Edit.");
      },
      function () {
        $("#prompt").text("");
      }
    );

    $(".del").hover(
      function () {
        $("#prompt").text("Delete this record.");
      },
      function () {
        $("#prompt").text("");
      }
    );

    $("#cancel").hover(
      function () {
        $("#prompt").text("Cancel Edit.");
      },
      function () {
        $("#prompt").text("");
      }
    );

    // Confirms the changes: removes edit buttons and clears the deleted rows array.
    $("#confirm")
      .off("click")
      .on("click", function () {
        $("thead tr th:last-child").remove();
        $("#" + divitem + " td:last-child").remove();
        $("#cancel").remove();
        itemDeleted = [];
        $("#add").prop("disabled", false);
        $("#cal").prop("disabled", false);
        $("#edit").prop("disabled", false);
      });

    // Cancels the changes: restores deleted rows and removes edit buttons.
    $("#cancel")
      .off("click")
      .on("click", function () {
        $.each(itemDeleted, function (index, row) {
          $("#" + divitem).append(row);
        });
        itemDeleted = [];
        $("thead tr th:last-child").remove();
        $("#" + divitem + " td:last-child").remove();
        $("#cancel").remove();
        sortTable(divitem);
        $("#add").prop("disabled", false);
        $("#cal").prop("disabled", false);
        $("#edit").prop("disabled", false);
      });
    return false;
  });
});

// .append() = Adds content inside the selected element(s), at the end
// .after() = Adds content after the selected element(s)
// .add() = Adds more elements to the set of matched elements, not for array
// .push() = add elements to the array
