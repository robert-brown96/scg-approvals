/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/record", "N/ui/serverWidget", "N/error", "N/workflow"], (
     record,
     serverWidget,
     error,
     workflow
) => {
     /**
      * Defines the Suitelet script trigger point.
      * @param {Object} context
      * @param {ServerRequest} context.request - Incoming request
      * @param {ServerResponse} context.response - Suitelet response
      * @since 2015.2
      */
     const onRequest = context => {
          try {
               if (context.request.method === "GET") _get(context);
               else _post(context);
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
     const _get = context => {
          let form = serverWidget.createForm({
               title: "Purchase Approval"
          });

          params.forEach(p => {
               if (!Object.keys(context.request.parameters).includes(p))
                    throw error.create({
                         name: "MISSING_REQUIRED_ARG",
                         message: `MISSING REQUIRED ARG ${p}`,
                         notifyOff: false
                    });
          });

          const { action, tran, approver, next, recType, state } =
               context.request.parameters;

          if (action === "APPROVE") {
               log.debug({
                    title: `ADVANCE TRANSACTION ${tran}`,
                    details: `next stage is ${next} by ${approver}`
               });

               // TODO: remove hard coded record type
               workflow.trigger({
                    actionId: next,
                    recordId: tran,
                    recordType: recType,
                    workflowId: "customworkflow_scg_vb_wf",
                    stateId: state
               });

               form = serverWidget.createForm({
                    title: "Purchase Approved",
                    hideNavBar: true
               });
               const approvedFld = form.addField({
                    id: "custpage_message",
                    type: serverWidget.FieldType.INLINEHTML,
                    label: "Approved"
               });
               approvedFld.defaultValue =
                    '<font size="8"><b>Purchase Approved Successfully</b></font>';
          } else if (action === "REJECT") {
               log.debug({
                    title: `REJECT TRANSACTION ${tran}`,
                    details: `next stage is ${next} by ${approver}`
               });

               // TODO: remove hard coded record type
               workflow.trigger({
                    actionId: next,
                    recordId: tran,
                    recordType: recType,
                    workflowId: "customworkflow_scg_vb_wf",
                    stateId: state
               });

               form.addSubmitButton({
                    label: "Submit"
               });
               const rejectMessageFld = form.addField({
                    id: "custpage_reject_message",
                    type: serverWidget.FieldType.LONGTEXT,
                    label: "Rejection Message"
               });
               rejectMessageFld.isMandatory = true;
               const tranFld = form.addField({
                    id: "custpage_reject_tran",
                    type: serverWidget.FieldType.TEXT,
                    label: "Rejection Transaction"
               });
               tranFld.defaultValue = tran;
               tranFld.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
               });

               const tranTypeFld = form.addField({
                    id: "custpage_reject_tran_type",
                    type: serverWidget.FieldType.TEXT,
                    label: "Rejection Transaction Type"
               });
               tranTypeFld.defaultValue = recType;
               tranTypeFld.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
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
     const _post = context => {
          log.debug("post", context);
          const form = serverWidget.createForm({
               title: "Purchase Rejected"
          });
          const {
               custpage_reject_message,
               custpage_reject_tran,
               custpage_reject_tran_type
          } = context.request.parameters;

          record.submitFields({
               type: custpage_reject_tran_type,
               id: custpage_reject_tran,
               values: {
                    custbody_scg_approval_rej_message: custpage_reject_message
               }
          });

          const approvedFld = form.addField({
               id: "custpage_message",
               type: serverWidget.FieldType.INLINEHTML,
               label: "Approved"
          });
          approvedFld.defaultValue =
               '<font size="8"><b>Purchase Rejected Successfully</b></font>';
          context.response.writePage(form);
     };

     const params = ["action", "tran", "next", "recType", "state"];

     return { onRequest };
});
