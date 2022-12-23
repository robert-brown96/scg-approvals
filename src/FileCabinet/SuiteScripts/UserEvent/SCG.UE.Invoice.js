/**
 * User Events for Invoice
 *
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @author Nick Weeks
 */
define(["N/record", "N/search"], function (record, search) {
     function beforeSubmit(context) {
          if (
               context.type !== context.UserEventType.EDIT &&
               context.type !== context.UserEventType.XEDIT
          )
               return;
          const curRec = context.newRecord;
          const billToAddress = curRec.getValue({
               fieldId: "billingaddress_key"
          });
          log.debug({
               title: "Bill To",
               details: billToAddress
          });
          if (!billToAddress) return;
          const fieldLookUp = search.lookupFields({
               type: "address",
               id: billToAddress,
               columns: ["custrecord_scg_email"]
          });
          const emailStr = fieldLookUp.custrecord_scg_email;
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

     const afterSubmit = context => {
          if (context.type !== context.UserEventType.CREATE) return;

          const { email, emailSetting } = getAddressEmails(context);

          const valObj = {};

          if (emailSetting) valObj.custbody_invoice_delivery_type = 1;
          if (email) valObj.custbody_invoice_email_address_list = email;

          record.submitFields({
               type: record.Type.INVOICE,
               id: context.newRecord.id,
               values: valObj
          });
     };

     /**
      *
      * @param context
      * @returns {{emailSetting: (*|number|Date|string|Array|boolean), email: (*|number|Date|string|Array|boolean)}}
      */
     const getAddressEmails = context => {
          try {
               const billAddRec = context.newRecord.getSubrecord({
                    fieldId: "billingaddress"
               });
               if (!billAddRec) return;

               const email = billAddRec.getValue({
                    fieldId: "custrecord_scg_email"
               });
               const emailSetting = billAddRec.getValue({
                    fieldId: "custrecord_email_invoice"
               });

               log.debug({
                    title: `email: ${emailSetting}`,
                    details: email
               });

               return { email, emailSetting };
          } catch (e) {
               log.error({
                    title: "Error setting emails",
                    details: e
               });
          }
     };
     return {
          beforeSubmit,
          afterSubmit
     };
});
