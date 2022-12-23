/**
 * User Events for Invoice
 *
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @author Nick Weeks
 */
define(["N/record", "N/search"], function (record, search) {
     function beforeSubmit(context) {
          var curRec = context.newRecord;
          var billToAddress = curRec.getValue({
               fieldId: "billingaddress_key"
          });
          if (!billToAddress) return;
          var fieldLookUp = search.lookupFields({
               type: "address",
               id: billToAddress,
               columns: ["custrecord_scg_email"]
          });
          var emailStr = fieldLookUp.custrecord_scg_email;
          log.debug("Emails to send to", emailStr);
          curRec.setValue({
               fieldId: "custbody_invoice_email_address_list",
               value: emailStr
          });
          if (emailStr) {
               curRec.setValue({
                    fieldId: "custbody_invoice_delivery_type",
                    value: 1
               });
          }
     }
     return {
          beforeSubmit: beforeSubmit
     };
});
