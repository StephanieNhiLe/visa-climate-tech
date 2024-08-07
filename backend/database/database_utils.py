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
 
def getBusinessDetails(category):
    return f"""
    SELECT
        [business_name] 
    FROM
        [VisaHack].[dbo].[businesses]
    WHERE
        [category] = '{category}'
    """

def getMonthlySpendSum(account_id):
    return f"""
    SELECT 
        Month,
        SUM(spend) AS Total,
        AVG(spend) AS Average,
        MIN(spend) AS Minimum,
        MAX(spend) AS Maximum
    FROM [VisaHack].[dbo].[cardData]
    WHERE account_id = '{account_id}'
    GROUP BY Month;
    """

def getOverallAvgSpend(account_id):
    return f"""
    -- Calculate overall average spend
    SELECT AVG(Total) AS OverallAverageSpend
    FROM (
        SELECT 
            Month,
            SUM(spend) AS Total
        FROM [VisaHack].[dbo].[cardData]
        WHERE account_id = '{account_id}'
        GROUP BY Month
    ) AS avg_totals;
    """

def getMonthlySpendByCategory(account_id):
    return f"""
    SELECT 
        month,
        re_category,
        SUM(spend) as total
    FROM [VisaHack].[dbo].[cardData]
    WHERE account_id = '{account_id}'
    GROUP BY Month, re_category;
    """