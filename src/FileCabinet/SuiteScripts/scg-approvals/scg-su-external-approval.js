/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/record", "N/ui/serverWidget", "N/error"], (
     record,
     serverWidget,
     error
) => {
     /**
      * Defines the Suitelet script trigger point.
      * @param {Object} context
      * @param {ServerRequest} context.request - Incoming request
      * @param {ServerResponse} context.response - Suitelet response
      * @since 2015.2
      */
     const onRequest = async context => {
          try {
               if (context.request.method === "GET") await _get(context);
               else await _post(context);
          } catch (e) {
               log.error({
                    title: "onRequest: ERROR",
                    details: e
               });
          }
     };

     /**
      * Defines the get function
      * @param {Object} context
      * @param {ServerRequest} context.request - Incoming request
      * @param {ServerResponse} context.response - Suitelet response
      * @since 2015.2
      */
     const _get = async context => {
          let form;
          await Promise.all(
               params.map(p => {
                    if (!Object.keys(context.request.parameters).includes(p))
                         throw error.create({
                              name: "MISSING_REQUIRED_ARG",
                              message: `MISSING REQUIRED ARG ${p}`,
                              notifyOff: false
                         });
               })
          );
          const { action, tran, approver, next, recType } =
               context.request.parameters;

          if (action === "APPROVE") {
               log.debug({
                    title: `ADVANCE TRANSACTION ${tran}`,
                    details: `next stage is ${next} by ${approver}`
               });

               record.submitFields({
                    type: recType,
                    id: parseInt(tran),
                    values: { custbody_scg_approval_s_hide: parseInt(next) }
               });
               form = serverWidget.createForm({
                    title: "Purchase Approved",
                    hideNavBar: true
               });
               const approvedFld = form.addField({
                    id: "custpage_message",
                    type: serverWidget.FieldType.INLINEHTML,
                    label: "Approved Successfully"
               });
               approvedFld.setDefaultValue(
                    '<font size="8"><b>Purchase Order Approved Successfully</b></font>'
               );
          } else if (action === "REJECT") {
               log.debug({
                    title: `REJECT TRANSACTION ${tran}`,
                    details: `next stage is ${next} by ${approver}`
               });
          } else
               throw error.create({
                    name: "INVALID_ACTION",
                    message: `INVALID ACTION ${action}`,
                    notifyOff: false
               });

          context.response.writePage(form);
     };

     /**
      * Defines the post function
      * @param {Object} context
      * @param {ServerRequest} context.request - Incoming request
      * @param {ServerResponse} context.response - Suitelet response
      * @since 2015.2
      */
     const _post = async context => {
          log.debug("post", context);
     };

     const params = ["action", "tran", "approver", "next", "recType"];

     return { onRequest };
});
