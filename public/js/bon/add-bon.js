console.log("hello from add-bon");
var nbProduit = 0;
var produits = [];
var produitToModify = null;
var selectedTr = null;

// to Add new product that will be associated with this order form(bon de commande):
$("#btn_add_produit").click(function (e) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') // add the CSRF token to the request.
        }
    });
    e.preventDefault();
    var produit_data = {
        produit_libelle: jQuery('#produit_libelle').val(),
        produit_ref: jQuery('#produit_ref').val(),
        produit_price: jQuery('#produit_price').val(),
    };
    var type = "POST";
    var ajax_url = '/produit';
    $.ajax({
        type: type,
        async: false,
        url: ajax_url,
        data: produit_data,
        dataType: 'json',
        success: function (produit) {
            produits.push(produit);
            addProduitToTable(produit, 'add');
        },
        error: function (errorResp) {
            let errors = JSON.parse(errorResp.responseText).errors; // get the errors validation.
            console.log(errors);
            for (const error in errors) { // loop through each error
                for (const errorMsg of errors[error]) { // loop through each error's messages.
                    console.log(errorMsg);
                }
            }
        }
    });
});
// to update a product that will be associated with this order form(bon de commande):
$("#btn_update_produit").click(function (e) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') // add the CSRF token to the request.
        }
    });
    e.preventDefault();
    debugger
    let produit_id = jQuery(this).data('produit_id');
    var produit_data = {
        produit_libelle: jQuery('#produit_libelle').val(),
        produit_ref: jQuery('#produit_ref').val(),
        produit_price: jQuery('#produit_price').val(),
    };
    var type = "PUT";
    var ajax_url = '/produit/' + produit_id;
    $.ajax({
        type: type,
        async: false,
        url: ajax_url,
        data: produit_data,
        dataType: 'json',
        success: function (produit) {
            debugger
            let produit_index = $.inArray(produitToModify, produits);
            Object.assign(produits[produit_index], produit); // update the product in the array with the new values.
            addProduitToTable(produit, 'update'); // to change infos of the modified product.
            backToInit();
        },
        error: function (errorResp) {
            let errors = JSON.parse(errorResp.responseText).errors; // get the errors validation.
            console.log(errors);
            for (const error in errors) { // loop through each error (for objects).
                for (const errorMsg of errors[error]) { // loop through each error's messages (for arrays).
                    console.log(errorMsg);
                }
            }
        }
    });
});


/**
 * Insert new tr element that represent a product
 * @param produit object of type Produit
 */
function addProduitToTable(produit, action) {
    debugger
    let tr = document.createElement('tr');

    let tdNbProduit = document.createElement('td');
    let tdRefProduit = document.createElement('td');
    let tdLibelleProduit = document.createElement('td');
    let tdPrixProduit = document.createElement('td');
    let tdEditProduit = document.createElement('td');
    let tdDeleteProduit = document.createElement('td');

    let nb = document.createTextNode((action == 'add') ? ++nbProduit : selectedTr.children("td:first-child").text());
    tdNbProduit.appendChild(nb);

    let ref = document.createTextNode(produit.ref);
    tdRefProduit.appendChild(ref);

    let libelle = document.createTextNode(produit.libelle);
    tdLibelleProduit.appendChild(libelle);

    let price = document.createTextNode(produit.price);
    tdPrixProduit.appendChild(price);

    let buttonEditproduit = document.createElement('button');
    buttonEditproduit.id = 'btn_edit_produit';
    buttonEditproduit.dataset.produit_id = produit.id;
    buttonEditproduit.textContent = 'modifier';
    // this function will fill the inputs with the product to modify:
    buttonEditproduit.onclick = function (e) {
        e.preventDefault();
        debugger;
        let produit_id = this.dataset.produit_id;
        // to find the product by id:
        produitToModify = jQuery.grep(produits, function (prd, index) {
            return prd.id == produit_id;
        })[0];

        // fill inputs with product's data to modify:
        jQuery('#produit_libelle').val(produitToModify.libelle);
        jQuery('#produit_ref').val(produitToModify.ref);
        jQuery('#produit_price').val(produitToModify.price);

        jQuery('#produit_libelle').focus(); // make focus on the libelle input.

        jQuery("#btn_update_produit").removeAttr('style');
        jQuery("#btn_update_produit").css('visibility', 'visible');

        jQuery("#btn_add_produit").css('visibility', 'collapse');

        jQuery("#btn_update_produit").data('produit_id', produit_id); // store product id in this button's dataset.

        selectedTr = jQuery(this).parents("tr");

        jQuery("#frm_produit").attr('action', '/produit/' + produit_id);
    }
    tdEditProduit.appendChild(buttonEditproduit);

    let buttonDeleteproduit = document.createElement('button');
    buttonDeleteproduit.id = 'btn_Delete_produit';
    buttonDeleteproduit.dataset.produit_id = produit.id;
    buttonDeleteproduit.textContent = 'supprimer';
    buttonDeleteproduit.onclick = function (e) {
        e.preventDefault();
        debugger;

        selectedTr = jQuery(this).parents("tr");

        deleteProduit(jQuery(this));
    }
    tdDeleteProduit.appendChild(buttonDeleteproduit);

    tr.appendChild(tdNbProduit);
    tr.appendChild(tdRefProduit);
    tr.appendChild(tdLibelleProduit);
    tr.appendChild(tdPrixProduit);
    tr.appendChild(tdEditProduit);
    tr.appendChild(tdDeleteProduit);
    if (action == 'add') {
        jQuery('#tbl_tbody_produits').append(tr);

        jQuery('#produit_ref').val("");

        let inpProduitsIds = jQuery('#produits_ids');
        inpProduitsIds.val((inpProduitsIds.val() == "") ? inpProduitsIds.val() + produit.id : inpProduitsIds.val() + "," + produit.id); // save ids of newly created products in order to associate them with this order form.

        alert('produit bien ajouté');
    } else if (action == 'update') {
        selectedTr.prev().after(tr); // insert tr with updated product's data in the same place.
        selectedTr.remove(); // remove the old tr.

        alert('produit bien modifié');
    }

    jQuery('#produit_libelle').focus();
}
/**
 * This will render an adding form
 */
function backToInit() {
    jQuery("#btn_update_produit").css('visibility', 'collapse');
    jQuery("#btn_add_produit").css('visibility', 'visible');

    jQuery('#produit_libelle').val("");
    jQuery('#produit_ref').val("");
    jQuery('#produit_price').val("");

    jQuery("#frm_produit").attr('action', '/produit');

    selectedTr = null;
}
/**
 * Delete product
 */
function deleteProduit(sender) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') // add the CSRF token to the request.
        }
    });

    let produit_id = sender.data('produit_id');

    var type = "DELETE";
    var ajax_url = '/produit/' + produit_id;
    $.ajax({
        type: type,
        async: false,
        url: ajax_url,
        dataType: 'json',
        success: function (produit) {
            debugger
            // remove from products array:
            produits = jQuery.grep(produits, function (prd, index) {
                return prd.id != produit.id;
            });

            // adjust the number of products:
            nbProduit = Number(selectedTr.children("td:first-child").text());
            nbTr = Number(jQuery("table tbody tr").length);
            // this condition for the case when the user remove all products from the order form.
            if (nbTr!== 1) {
                // this condition to handle the case when the user remove the last product from the order form.
                if (nbProduit < nbTr) {
                    for (let i = nbProduit + 1; i <= nbTr; i++) {
                        jQuery("table tbody tr:nth-child("+i+")").children("td:first-child").text((i<nbTr)?nbProduit++:nbProduit);
                    }
                } else {
                    nbProduit--;
                }
            } else {
                nbProduit = 0;
            }

            let inpProduitsIds = jQuery('#produits_ids');
            let newProduitsIds = inpProduitsIds.val().split(',');
            newProduitsIds = jQuery.grep(newProduitsIds, function (id, index) {
                return id != produit.id;
            });
            inpProduitsIds.val(newProduitsIds.join());

            selectedTr.remove();
            selectedTr = null;
        },
        error: function (errorResp) {
            let errors = JSON.parse(errorResp.responseText).errors; // get the errors validation.
            console.log(errors);
            for (const error in errors) { // loop through each error (for objects).
                for (const errorMsg of errors[error]) { // loop through each error's messages (for arrays).
                    console.log(errorMsg);
                }
            }
        }
    });
}
