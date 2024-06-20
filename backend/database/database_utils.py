def checkAccountExistanceQuery(username, password):
    return f"""
        SELECT  
            COUNT(*)
        FROM 
            [VisaHack].[dbo].[userAccount]
        WHERE 
            [username] = '{username}'
            AND
            [password] = '{password}'
"""


def getAccountDetails(username, password):
    return f"""
    WITH UserInfo AS 
    (
        SELECT  
            [account_id],
            [first_name],
            [last_name]
        FROM 
            [VisaHack].[dbo].[userAccount]
        WHERE 
            [username] = '{username}'
            AND
            [password] = '{password}'
    )
    SELECT 
        TOP(1)
        UI.account_id,
        UI.first_name,
        UI.last_name,
        BD.persona
    FROM
        [dbo].[bankingData] AS BD
    INNER JOIN 
        UserInfo AS UI on UI.account_id = BD.account_id
    """
