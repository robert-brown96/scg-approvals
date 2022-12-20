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
          const { action, tran, approver, next } = context.request.parameters;

          if (action === "APPROVE") {
               log.debug({
                    title: `ADVANCE TRANSACTION ${tran}`,
                    details: `next stage is ${next} by ${approver}`
               });
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
     };

     /**
      * Defines the post function
      * @param {Object} context
      * @param {ServerRequest} context.request - Incoming request
      * @param {ServerResponse} context.response - Suitelet response
      * @since 2015.2
      */
     const _post = async context => {};

     const params = ["action", "tran", "approver", "next"];

     return { onRequest };
});
