from flask import request, jsonify
from collections import namedtuple

STATUS_CODE_OK = 200
STATUS_CODE_BAD_REQUEST = 400
STATUS_CODE_NOT_FOUND = 404
STATUS_CODE_INTERNAL_SERVER_ERROR = 500


ResponseObject = namedtuple(
    'ResponseObject', ['expected_response', 'error_response', 'status_code'])


def get_response_object(required_fields) -> ResponseObject:
    """
    A response object has the format of

    expected_response: holds what data the client wants to expect this is considered
    a happy case.

    error_response: holds what failure json object is returned when the either no data is to be sent
    or fields were missing during the request.

    status_code: shares information of the transaction 200 indicating OK and 400 indicating a error has 
            occured (BAD REQUEST)
    """

    data = request.get_json()

    if not data:
        return ResponseObject(
            expected_response=None,
            error_response=jsonify(
                {'success': False, 'message': 'Data is required'}),
            status_code=STATUS_CODE_BAD_REQUEST)

    missing_fields = [
        field for field in required_fields if not data.get(field)]

    if missing_fields:
        return ResponseObject(
            expected_response=None,
            error_response=jsonify(
                {'success': False, 'message': f"{', '.join(missing_fields)} are required"}),
            status_code=STATUS_CODE_BAD_REQUEST)

    return ResponseObject(expected_response=data,
                          error_response=None,
                          status_code=STATUS_CODE_OK)
