export const StatusCode = {
    SUCCESS: { status: 200, message: 'Success' },
    CREATED: { status: 201, message: 'Created' },
    ACCEPTED: { status: 202, message: 'Accepted' },
    NO_CONTENT: { status: 204, message: 'No Content' },
    BAD_REQUEST: { status: 400, message: 'Bad Request' },
    UNAUTHORIZED: { status: 401, message: 'Unauthorized' },
    FORBIDDEN: { status: 403, message: 'Forbidden' },
    NOT_FOUND: { status: 404, message: 'Not Found' },
    CONFLICT: { status: 409, message: 'Conflict' },
    INTERNAL_SERVER_ERROR: { status: 500, message: 'Internal Server Error' },
    NOT_IMPLEMENTED: { status: 501, message: 'Not Implemented' },
    BAD_GATEWAY: { status: 502, message: 'Bad Gateway' },
    SERVICE_UNAVAILABLE: { status: 503, message: 'Service Unavailable' },
    GATEWAY_TIMEOUT: { status: 504, message: 'Gateway Timeout' },
};