/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(["N/email", "N/render", "N/runtime", "N/search", "N/file", "N/record"], (
     email,
     render,
     runtime,
     search,
     file,
     // eslint-disable-next-line no-unused-vars
     record
) => {
     /**
      * Defines the WorkflowAction script trigger point.
      * @param {Object} context
      * @param {Record} context.newRecord - New record
      * @param {Record} context.oldRecord - Old record
      * @param {string} context.workflowId - Internal ID of workflow which triggered this action
      * @param {string} context.type - Event type
      * @param {Form} context.form - Current form that the script uses to interact with the record
      * @since 2016.1
      */
     const onAction = context => {
          try {
               log.debug({
                    title: "start",
                    details: context
               });
               const scrip = runtime.getCurrentScript();

               const transactionId = context.newRecord.id;

               const senderId = scrip.getParameter({
                    name: "custscript_sender"
               });
               //let recipientEmail;
               const recipientId = scrip.getParameter({
                    name: "custscript_recipient"
               });
               const includeFiles = scrip.getParameter({
                    name: "custscript_include_files"
               });
               const fileObjs = [];

               // get all attachments if parameter is true
               if (includeFiles) {
                    //attach the transaction print out
                    const pdfTran = render.transaction({
                         entityId: transactionId,
                         printMode: render.PrintMode.PDF
                    });
                    fileObjs.push(pdfTran);

                    // check if any other files are attached
                    const transactionSearchObj = search.create({
                         type: "transaction",
                         filters: [
                              ["mainline", "is", "T"],
                              "AND",
                              ["internalid", "anyof", transactionId]
                         ],
                         columns: [
                              search.createColumn({
                                   name: "internalid",
                                   join: "file",
                                   label: "Internal ID"
                              })
                         ]
                    });
                    transactionSearchObj.run().each(res => {
                         const fileId = res.getValue({
                              name: "internalid",
                              join: "file",
                              label: "Internal ID"
                         });
                         if (fileId) {
                              const fileObj = file.load({
                                   id: fileId
                              });
                              fileObjs.push(fileObj);
                         }
                         return true;
                    });
               }

               const templateId = scrip.getParameter({
                    name: "custscript_template"
               });

               const mergeResult = render.mergeEmail({
                    templateId,
                    transactionId
               });

               email.send({
                    author: senderId,
                    recipients: recipientId,
                    subject: mergeResult.subject,
                    body: mergeResult.body,
                    attachments: fileObjs,
                    relatedRecords: {
                         entityId: recipientId,
                         transactionId
                    }
               });
               // record.submitFields({
               //      type: context.newRecord.type,
               //      id: transactionId,
               //      values: {
               //           custbody_scg_approval_last_email_date: new Date()
               //      }
               // });
          } catch (e) {
               log.error({
                    title: "onAction: ERROR",
                    details: e
               });
               // record.submitFields({
               //      type: context.newRecord.type,
               //      id: context.newRecord.id,
               //      values: {
               //           custbody_scg_approval_last_email_error: e
               //      }
               // });
          }
     };

     return { onAction };
});
