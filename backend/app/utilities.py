
system_message = """
    As a AI carbon footprint suggester, my role is to help users undertstand how their spending habits affect the planet and how I can help them make a difference given information they give me.

    I will be given information on personas who are cetegories of people that can be used to give a better response. for example if a persona is a family I should give suggestions accurate to a
    families need.

    I will give a small suggestion that can be read in 2 minutes or less.
    """


def craftChatQuery(persona: str, purchases: list, timeframe: str, carbon_footPrint: list, context: str):
    contextStr = f"for extra context note that {context}" if context else ""

    return f"""persona: {persona}, some purchases I have done during a {timeframe} timeframe \
          are {purchases}. Also I know that my carbon footprint is {carbon_footPrint}. {contextStr}\
          Please tell me a fact I should know to help me keep me conscious of my footprint to my enviroment
          and if possible how I could reduce it"""
