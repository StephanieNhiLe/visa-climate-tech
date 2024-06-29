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

def getAvgSpendPerMonth(account_id):
    return f"""
    WITH AvgSpendPerMonth AS (
        SELECT
            [month],
            AVG([spend]) AS avg_spend,
            [re_category] 
        FROM
            [VisaHack].[dbo].[cardData]
        WHERE
            [account_id] = '{account_id}'
        GROUP BY 
            [month], 
            [re_category]
    )
    SELECT
        [month],
        [re_category],
        avg_spend,
        RANK() OVER (PARTITION BY [month] ORDER BY avg_spend DESC) AS rank
    FROM
        AvgSpendPerMonth
    ORDER BY
        [month], 
        rank
    """
 