from flask import request, jsonify
from collections import namedtuple
import json

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


def get_mock_ecolytiqs_response_object(account_id: str, transaction_parameters: dict):
    data = getCarbonFootPrintCache()

    account_in_cache = len(
        [entry for entry in data if entry["account_id"] == account_id]) == 1

    if not account_in_cache:
        return ResponseObject(expected_response=None,
                              error_response=jsonify(
                                  {'success': False, 'message': "No account is found"}),
                              status_code=STATUS_CODE_NOT_FOUND)

    # Finds the first entry that matches
    response_data = next(
        entry for entry in data if entry["account_id"] == account_id)

    return ResponseObject(expected_response=jsonify(
        {'success': True, 'transactions': response_data["transactions"]}),
        error_response=None,
        status_code=STATUS_CODE_OK
    )


def getCarbonFootPrintCache():
    with open('ecolytiq_mock.json', 'r') as file:
        return json.load(file)


# get_mock_ecolytiqs_response_object("94177e7a3daa4ef18746b355980ebd5f", None)
