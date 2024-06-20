def checkAccountExistanceQuery(username, password): return f"""
SELECT  
    COUNT(*)
FROM 
    [VisaHack].[dbo].[userAccount]
WHERE 
    [username] = '{username}'
    AND
    [password] = '{password}'
"""
