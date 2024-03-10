# ******** PREPARE R SESSION ******** ----

# This part is heavily based on the scripts for the analyses of Sebben & Ullrich (2021).
# Can conditionals explain explanations? A modus ponens model of B because A. Cognition
# See for example https://osf.io/wnczr/

# WARNING: 
# The following line of code will remove all objects from the workspace. 
# Please consider saving your workspace.
rm(list=ls())

# WARNING: 
# All currently loaded packages will be detached and unloaded.
# Packages needed to run this script will be loaded. 
# Missing packages will be downloaded and installed.
# Also, the working directory will be automatically 
# set to the location of this script.
# If you did not alter the structure of the folder containing this script 
# and the data, in most cases you should be able to run this script without any 
# manual adjustments in a current version of RStudio.

# Detach and unload packages ----
if(!is.null(sessionInfo()$otherPkgs)){
  invisible(lapply(paste('package:', names(sessionInfo()$otherPkgs), sep = ""), 
                   detach, character.only = T, unload = T))
}

# Download and install missing packages ----
requiredPackages <- c(
  
  # Import, transform and write dataset
  "readxl",

  # Handle data
  "dplyr",
  "broom",

  # GLMM
  "lme4",
  "car",
  "emmeans",

  # Check GLMM assumption
  "DHARMa",
  
  # Bayes Factors
  "BayesFactor",
  "bayestestR",
  "effectsize",
  
  # Plot
  "ggplot2",
  "gridExtra",
  "extrafont"
  
)

missingPackages <- requiredPackages[!requiredPackages 
                                    %in% installed.packages()[ ,"Package"]]

if(length(missingPackages) > 0){
  install.packages(missingPackages)
}

# Load required packages ----
invisible(lapply(requiredPackages, require, character.only = T))

# Set working directory to source file location ----
setwd(dirname(rstudioapi::getActiveDocumentContext()$path)) 

# Set seed to ensure replicability of the results ----
set.seed(1234)



# ******** DATASETS ******** ----

remove(list = ls())

# Import dataset ----
data_Exp2 <- as.data.frame(read_excel("data.xlsx"))

# Create various variables ----

# >>>> AgeCondition ----
data_Exp2$AgeCondition <- ifelse(data_Exp2$Age < 65, 0, 1) # 0 = Younger adults, 1 = Older adults

data_Exp2 %>%
  group_by(AgeCondition) %>%
  summarise(
    n = n(),
    min = min(Age),
    max = max(Age)
  )

data_Exp2$AgeConditionPlot <- ifelse(data_Exp2$AgeCondition == 0, "YAs", "OAs")
data_Exp2$AgeConditionPlot <- factor(data_Exp2$AgeConditionPlot, levels = c("YAs", "OAs"))


# >>>> Create variable where 0s are categorized depending on whether they were drawn from the risky or the safe deck ----
namevector <- paste("OutcomeChosen0Explicit_", 1:20, sep = "")

for(i in namevector){
  data_Exp2[,i] <- NA
}

indexColNum = c(which(colnames(data_Exp2)=="OutcomeChosen0Explicit_1"):(which(colnames(data_Exp2)=="OutcomeChosen0Explicit_20")))
outcomeChosenColNum = c(which(colnames(data_Exp2)=="OutcomeChosen_01"):(which(colnames(data_Exp2)=="OutcomeChosen_20")))
deckChosenColNum = c(which(colnames(data_Exp2)=="DeckChosen_01"):(which(colnames(data_Exp2)=="DeckChosen_20")))


for(n in 1:nrow(data_Exp2)){
  
  trackOutcomeChosen = 1
  trackDeckChosen = 1
  
  for(i in indexColNum[1]:indexColNum[length(indexColNum)]){
    
    if(data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]] == 0 && data_Exp2[n, deckChosenColNum[trackOutcomeChosen]] == 0){
      valueIndex = "0Safe"
    } else if(data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]] == 0 && data_Exp2[n, deckChosenColNum[trackOutcomeChosen]] == 1){
      valueIndex = "0Risky"
    } else {
      valueIndex = data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]]
    }
    
    data_Exp2[n, i] = valueIndex
    
    trackOutcomeChosen = trackOutcomeChosen + 1
    
  }
}


# >>>> Create variable where 0s are categorized depending on whether they were drawn from the risky or the safe deck - Only selected round ----

namevector <- "OutcomeChosen0Explicit_SelectedRound"

for(i in namevector){
  data_Exp2[,i] <- NA
}

indexColNum = which(colnames(data_Exp2)=="OutcomeChosen0Explicit_SelectedRound")
selectedRoundColNum = which(colnames(data_Exp2)=="RoundSelectedForPrize")
outcomeChosenColNum = c(which(colnames(data_Exp2)=="OutcomeChosen_01"):(which(colnames(data_Exp2)=="OutcomeChosen_20")))
deckChosenColNum = c(which(colnames(data_Exp2)=="DeckChosen_01"):(which(colnames(data_Exp2)=="DeckChosen_20")))


for(n in 1:nrow(data_Exp2)){
  
  trackRound = as.numeric(data_Exp2[n, selectedRoundColNum])
  
  if(data_Exp2[n, outcomeChosenColNum[trackRound]] == 0 && data_Exp2[n, deckChosenColNum[trackRound]] == 0){
    valueIndex = "0Safe"
  } else if(data_Exp2[n, outcomeChosenColNum[trackRound]] == 0 && data_Exp2[n, deckChosenColNum[trackRound]] == 1){
    valueIndex = "0Risky"
  } else {
    valueIndex = data_Exp2[n, outcomeChosenColNum[trackRound]]
  }
  
  data_Exp2[n, indexColNum] = valueIndex
  
}


# >>>> Index to control for previous outcomes experienced ----

# It indicates the number of consecutive losses (negative integers) or wins (positive integers) experienced up to that point

namevector <- paste("OutcomeIndex_Until", 1:20, sep = "")

for(i in namevector){
  data_Exp2[,i] <- NA
}

data_Exp2["OutcomeIndex_Until1"] = as.integer(-9)                           # First three columns always equal -9 to indicate that not enough outcomes have been experienced yet to compute the index

indexColNum = c(which(colnames(data_Exp2)=="OutcomeIndex_Until1"):(which(colnames(data_Exp2)=="OutcomeIndex_Until20")))
outcomeChosenColNum = c(which(colnames(data_Exp2)=="OutcomeChosen_01"):(which(colnames(data_Exp2)=="OutcomeChosen_20")))


for(n in 1:nrow(data_Exp2)){
  
  trackOutcomeChosen = 2
  consecutiveOutcomes = 0
  
  for(i in indexColNum[2]:indexColNum[length(indexColNum)]){
      
      #  If you have experienced a negative outcome
      if (data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen-1]] < 0 && data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]] < 0){   # and you experience another negative outcome    
        
        consecutiveOutcomes = consecutiveOutcomes - 1
        data_Exp2[n, i] = consecutiveOutcomes
        
      } else if (data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen-1]] == 0 && data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]] < 0){     # and you experience a neutral outcome
        
        consecutiveOutcomes = 0
        data_Exp2[n, i] = consecutiveOutcomes
        
      } else if (data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen-1]] > 0 && data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]] < 0){     # and you experience a positive outcome
        
        consecutiveOutcomes = 0
        data_Exp2[n, i] = consecutiveOutcomes
        
        
      # If you have experienced a neutral outcome
      } else if (data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]] == 0){
          
          consecutiveOutcomes = 0
          data_Exp2[n, i] = consecutiveOutcomes
        
        
      #  If you have experienced a positive outcome
      } else if (data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen-1]] < 0 && data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]] > 0){   # and you experience a negative outcome    
        
        consecutiveOutcomes = 0
        data_Exp2[n, i] = consecutiveOutcomes
        
      } else if (data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen-1]] == 0 && data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]] > 0){     # and you experience a neutral outcome 
        
        consecutiveOutcomes = 0
        data_Exp2[n, i] = consecutiveOutcomes
        
      } else if (data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen-1]] > 0 && data_Exp2[n, outcomeChosenColNum[trackOutcomeChosen]] > 0){     # and you experience a positive outcome 
        
        consecutiveOutcomes = consecutiveOutcomes + 1
        data_Exp2[n, i] = consecutiveOutcomes
        
      }
      
    
    trackOutcomeChosen = trackOutcomeChosen + 1
    
  }
  
}


# Dataset for GLMM ----

# Retrieve columns numbers
{participantColNum = which(colnames(data_Exp2)=="Participant")
  deckChosenColNum = c(which(colnames(data_Exp2)=="DeckChosen_01"):(which(colnames(data_Exp2)=="DeckChosen_20")))
  outcomeChosenColNum = c(which(colnames(data_Exp2)=="OutcomeChosen_01"):(which(colnames(data_Exp2)=="OutcomeChosen_20")))
  checkedForgoneColNum = c(which(colnames(data_Exp2)=="CheckedForgone_01"):(which(colnames(data_Exp2)=="CheckedForgone_20")))
  outcomeForgoneColNum = c(which(colnames(data_Exp2)=="OutcomeForgone_01"):(which(colnames(data_Exp2)=="OutcomeForgone_20")))
  ageConditionColNum = c(which(colnames(data_Exp2)=="AgeCondition"))
  outcomeChosen0ExplColNum = c(which(colnames(data_Exp2)=="OutcomeChosen0Explicit_1"):(which(colnames(data_Exp2)=="OutcomeChosen0Explicit_20")))
  OutcomeIndexColNum = c(which(colnames(data_Exp2)=="OutcomeIndex_Until1"):(which(colnames(data_Exp2)=="OutcomeIndex_Until20")))
}

tempDataGLMM <- data_Exp2[, c(participantColNum,
                               deckChosenColNum,
                               outcomeChosenColNum,
                               checkedForgoneColNum,
                               outcomeForgoneColNum,
                               ageConditionColNum,
                               outcomeChosen0ExplColNum,
                               OutcomeIndexColNum)]

{deckChosenColNum = c(which(colnames(tempDataGLMM)=="DeckChosen_01"):(which(colnames(tempDataGLMM)=="DeckChosen_20")))
  outcomeChosenColNum = c(which(colnames(tempDataGLMM)=="OutcomeChosen_01"):(which(colnames(tempDataGLMM)=="OutcomeChosen_20")))
  checkedForgoneColNum = c(which(colnames(tempDataGLMM)=="CheckedForgone_01"):(which(colnames(tempDataGLMM)=="CheckedForgone_20")))
  outcomeForgoneColNum = c(which(colnames(tempDataGLMM)=="OutcomeForgone_01"):(which(colnames(tempDataGLMM)=="OutcomeForgone_20")))
  outcomeChosen0ExplColNum = c(which(colnames(tempDataGLMM)=="OutcomeChosen0Explicit_1"):(which(colnames(tempDataGLMM)=="OutcomeChosen0Explicit_20")))
  OutcomeIndexColNum = c(which(colnames(tempDataGLMM)=="OutcomeIndex_Until1"):(which(colnames(tempDataGLMM)=="OutcomeIndex_Until20")))
}
                               

dataGLMM_Exp2 <- reshape(tempDataGLMM, idvar=c('Participant', 'AgeCondition'),
                          direction="long", 
                          varying=list(DeckChosen=deckChosenColNum, 
                                       OutcomeChosen=outcomeChosenColNum, 
                                       CheckedForgone=checkedForgoneColNum, 
                                       OutcomeForgone=outcomeForgoneColNum, 
                                       OutcomeChosenExplicit = outcomeChosen0ExplColNum,
                                       OutcomeIndex = OutcomeIndexColNum),
                          v.names = c("DeckChosen", 
                                      "OutcomeChosen", 
                                      "CheckedForgone", 
                                      "OutcomeForgone", 
                                      "OutcomeChosenExplicit",
                                      "OutcomeIndex"))

dataGLMM_Exp2 <- dataGLMM_Exp2[order(dataGLMM_Exp2$Participant), ]
colnames(dataGLMM_Exp2)[which(colnames(dataGLMM_Exp2)=="time")] <- "Round"


dataGLMM_Exp2$OutcomeChosen <-  as.factor(dataGLMM_Exp2$OutcomeChosen)
dataGLMM_Exp2$DeckChosen <-  as.factor(dataGLMM_Exp2$DeckChosen)

dataGLMM_Exp2$AgeConditionPlot <- ifelse(dataGLMM_Exp2$AgeCondition == 0, "Younger adults", "Older adults")
dataGLMM_Exp2$AgeConditionPlot <- factor(dataGLMM_Exp2$AgeConditionPlot, levels = c("Younger adults", "Older adults"))




# ******** DESCRIPTIVES ******** ----

# Gender and age ----
data_Exp2 %>%
  group_by(AgeCondition, Gender) %>%
  summarise(
    n = n(),
    meanAge = mean(Age),
    sdAge = sd(Age)) %>%
  mutate(percentage = n / sum(n))

data_Exp2 %>%
  group_by(AgeCondition) %>%
  summarise(
    n = n(),
    meanAge = mean(Age),
    sdAge = sd(Age)) %>%
  mutate(percentage = n / sum(n))



# ******** Deck chosen ******** ----

# Deck chosen (0 = safe, 1 = risky)
dataGLMM_Exp2 %>%
  group_by(AgeCondition, DeckChosen) %>%
  summarise(
    n = n()) %>%
  mutate(percentage = n*100 / sum(n))


data_Exp2$SumRisky <- rowSums(subset(data_Exp2, select = c(DeckChosen_01:DeckChosen_20)), na.rm = TRUE)
data_Exp2$PercentageRisky = data_Exp2$SumRisky/20
data_Exp2$PercentageRiskyBins = ifelse(data_Exp2$PercentageRisky == 0, "0", 
                                         ifelse(data_Exp2$PercentageRisky < 0.25, "1-24", 
                                                ifelse(data_Exp2$PercentageRisky < 0.45, "25-44",
                                                       ifelse(data_Exp2$PercentageRisky < 0.55, "45-54",
                                                              ifelse(data_Exp2$PercentageRisky < 0.75, "55-74",
                                                                     ifelse(data_Exp2$PercentageRisky < 0.99, "74-99", "100"))))))

data_Exp2$PercentageRiskyBins = factor(data_Exp2$PercentageRiskyBins, levels = c("0", "1-24", "25-44", "45-54", "55-74", "74-99", "100"))

data_Exp2$AgeConditionPlot <- ifelse(data_Exp2$AgeCondition == 0, "Younger adults", "Older adults")
data_Exp2$AgeConditionPlot <- factor(data_Exp2$AgeConditionPlot, levels = c("Younger adults", "Older adults"))


plot <- data_Exp2 %>%
  group_by(AgeConditionPlot, PercentageRiskyBins) %>%
  summarise(
    n = n()) %>%
  mutate(percentage = n*100 / sum(n))

g <- ggplot(plot, aes(fill=AgeConditionPlot, y=percentage, x=PercentageRiskyBins)) + 
  geom_col(color='#e9ecef', alpha=0.6, position='dodge') + 
  guides(fill=guide_legend(title="Age group")) +
  theme_classic() +
  theme(axis.title = element_text(size = 24)) +
  theme(axis.text = element_text(size = 21)) +
  theme(axis.text.x = element_text(colour = "black")) +
  theme(legend.text = element_text(size=24), legend.title = element_text(size=24), legend.position = "bottom") +
  xlab("\nPercentege risky choices") +
  ylab("Percentage by age group\n") + 
  scale_y_continuous(limits = c(0,35.5), expand = c(0, 0)) +
  theme(text=element_text(family = "Times New Roman"))  +
  scale_fill_brewer(palette="Set1")

g

ggsave(filename = "Exp2_B2.tiff", plot = g, width = 12, height = 5, device='tiff', dpi=300)



# GLMM ----

# Set deviation (aka effect) coding (for tips on interpretation, see
# https://stats.oarc.ucla.edu/other/mult-pkg/faq/general/faq-how-do-i-interpret-the-coefficients-of-an-effect-coded-variable-involved-in-an-interaction-in-a-regression-model/#effect-coding-for-categorical-predictors-with-3-or-more-levels)

dataGLMM_Exp2$AgeCondition <- factor(dataGLMM_Exp2$AgeCondition, levels = c("1", "0"))
contrasts(dataGLMM_Exp2$AgeCondition) = contr.sum(2)

glmm <- glmer(DeckChosen ~ AgeCondition + (1 | Participant),
              data = dataGLMM_Exp2,
              family = binomial(link="logit"),
              control = glmerControl(optimizer = "bobyqa"),
              nAGQ = 1)


# Check assumptions
# https://cran.r-project.org/web/packages/DHARMa/vignettes/DHARMa.html

simulationOutput <- simulateResiduals(fittedModel = glmm, plot = F, n = 10000)
qqnorm(residuals(simulationOutput, quantileFunction = qnorm, outlierValues = c(-7,7)), pch = 1, frame = FALSE)
plotQQunif(simulationOutput) 
plotResiduals(simulationOutput)

summary(glmm)
Anova(glmm, type = "III")

exp(fixef(glmm))
exp(confint.merMod(glmm, method = "Wald"))


# Bayesian check for non significant effects
# See: https://easystats.github.io/bayestestR/articles/bayes_factors.html
noAgeModel = update(glmm, formula = ~ . -AgeCondition)

comparisonBF <- bayesfactor_models(glmm, denominator = noAgeModel)
comparisonBF
interpret_bf(exp(comparisonBF$log_BF[1]), include_value = TRUE)


# Experienced outcomes ----
percentageExperiencedOutcomes = dataGLMM_Exp2 %>%
  group_by(AgeConditionPlot, OutcomeChosenExplicit) %>%
  summarise(
    n = n()) %>%
  mutate(percentage = n*100 / sum(n))

percentageExperiencedOutcomes$OutcomeChosenExplicit = factor(percentageExperiencedOutcomes$OutcomeChosenExplicit,
                                                             levels = c("-60", "-30", "-20", "-10", "0Risky", "0Safe", "10", "20", "30", "60"))
g <- ggplot(data=percentageExperiencedOutcomes, aes(x=OutcomeChosenExplicit, y=percentage, fill=AgeConditionPlot)) +
  geom_col(color='#e9ecef', alpha=0.6, position='dodge') + 
  guides(fill=guide_legend(title="Age group")) +
  theme_classic() +
  theme(axis.title = element_text(size = 24)) +
  theme(axis.text = element_text(size = 21)) +
  theme(axis.text.x = element_text(colour = "black")) +
  theme(legend.text = element_text(size=24), legend.title = element_text(size=24), legend.position = "bottom") +
  xlab("\nOutcome experienced") +
  ylab("Percentage by age group\n") + 
  scale_y_continuous(limits = c(0,15.5), expand = c(0, 0)) +
  theme(text=element_text(family = "Times New Roman")) +
  scale_fill_brewer(palette="Set1")

g

ggsave(filename = "Exp2_B1.tiff", plot = g, width = 12, height = 5, device='tiff', dpi=300)




# ******** COUNTERFACTUAL CURIOSITY ******** ----


# GLMM - Main ----

# Set deviation (aka effect) coding (for tips on interpretation, see
# https://stats.oarc.ucla.edu/other/mult-pkg/faq/general/faq-how-do-i-interpret-the-coefficients-of-an-effect-coded-variable-involved-in-an-interaction-in-a-regression-model/#effect-coding-for-categorical-predictors-with-3-or-more-levels)

dataGLMM_Exp2$AgeCondition <- factor(dataGLMM_Exp2$AgeCondition, levels = c("1", "0"))
contrasts(dataGLMM_Exp2$AgeCondition) = contr.sum(2)

dataGLMM_Exp2$OutcomeChosenExplicit = factor(dataGLMM_Exp2$OutcomeChosenExplicit, levels = c("-60", "-30", "-20", "-10", "0Risky", "0Safe", "10", "20", "30", "60"))
contrasts(dataGLMM_Exp2$OutcomeChosenExplicit) = contr.sum(10)


glmm <- glmer(CheckedForgone ~ AgeCondition * OutcomeChosenExplicit + (1 | Participant),
              data = dataGLMM_Exp2,
              family = binomial(link="logit"),
              control = glmerControl(optimizer = "bobyqa"),
              nAGQ = 1)

# Check assumptions
# https://cran.r-project.org/web/packages/DHARMa/vignettes/DHARMa.html

simulationOutput <- simulateResiduals(fittedModel = glmm, plot = F, n = 10000)
qqnorm(residuals(simulationOutput, quantileFunction = qnorm, outlierValues = c(-7,7)), pch = 1, frame = FALSE)
plotQQunif(simulationOutput)
plotResiduals(simulationOutput)


summary(glmm)
Anova(glmm, type = "III")

# ORs and confidence intervals
exp(fixef(glmm))
exp(confint.merMod(glmm, method = "Wald"))


# Post-hoc with bonferroni adjustment 
emmeans(glmm, pairwise~AgeCondition, type = "response", adjust="bonferroni")
emmeans(glmm, pairwise~OutcomeChosenExplicit, type = "response", adjust="bonferroni")


dataGLMM_Exp2 %>%
  group_by(AgeCondition, CheckedForgone) %>%
  summarise(
    n = n()) %>%
  mutate(percentage = n / sum(n))

dataGLMM_Exp2 %>%
  group_by(OutcomeChosenExplicit, CheckedForgone) %>%
  summarise(
    n = n()) %>%
  mutate(percentage = n*100 / sum(n))



# Bayesian check for non significant effects
# See: https://easystats.github.io/bayestestR/articles/bayes_factors.html
noAgeModel = update(glmm, formula = ~ . -AgeCondition -AgeCondition:OutcomeChosen)
comparisonBF <- bayesfactor_models(glmm, denominator = noAgeModel)
comparisonBF
interpret_bf(exp(comparisonBF$log_BF[1]), include_value = TRUE)


mainEffectModel = update(glmm, formula = ~ . -AgeCondition:OutcomeChosenExplicit)
comparisonBF <- bayesfactor_models(glmm, denominator = mainEffectModel)
comparisonBF
interpret_bf(exp(comparisonBF$log_BF[1]), include_value = TRUE)





# Plot counterfactual curiosity ----
dataGLMM_Exp2$AgeCondition <- factor(dataGLMM_Exp2$AgeCondition, levels = c("1", "0"))
contrasts(dataGLMM_Exp2$AgeCondition) = contr.sum(2)

dataGLMM_Exp2$OutcomeChosenExplicit = factor(dataGLMM_Exp2$OutcomeChosenExplicit, levels = c("-60", "-30", "-20", "-10", "0Risky", "0Safe", "10", "20", "30", "60"))
contrasts(dataGLMM_Exp2$OutcomeChosenExplicit) = contr.sum(10)

 CLD <- dataGLMM_Exp2 %>%
  group_by(AgeCondition, OutcomeChosenExplicit, CheckedForgone) %>%
  summarise(
    n = n()) %>%
  mutate(percentage = n*100 / sum(n))

CLD2 <- dataGLMM_Exp2 %>%
  group_by(AgeCondition, OutcomeChosenExplicit) %>%
  summarise(
    n = n()) %>%
  mutate(percentage = n*100 / sum(n))

CLD = CLD[!(CLD$CheckedForgone == 0),]


CLD$DeckChosen <- ifelse(CLD$OutcomeChosenExplicit == "-60" | 
                           CLD$OutcomeChosenExplicit == "-20" | 
                           CLD$OutcomeChosenExplicit == "0Risky" |
                           CLD$OutcomeChosenExplicit == "20" | 
                           CLD$OutcomeChosenExplicit == "60", "Risky", "Safe")

CLD$AgeConditionPlot <- ifelse(CLD$AgeCondition == "0", "Younger adults", "Older adults")
CLD$AgeConditionPlot <- factor(CLD$AgeConditionPlot, levels = c("Younger adults", "Older adults"))

CLDSafe <- CLD[(CLD$DeckChosen == "Safe"), ]
levels(CLDSafe$OutcomeChosenExplicit)[levels(CLDSafe$OutcomeChosenExplicit)=="0Safe"] <- "0"
CLDRisky <- CLD[(CLD$DeckChosen == "Risky"), ]
levels(CLDRisky$OutcomeChosenExplicit)[levels(CLDRisky$OutcomeChosenExplicit)=="0Risky"] <- "0"

xdisplace = 0.28
ydisplace = 0.001
fontsize = 6

g1 <- ggplot(CLDSafe, aes(x = OutcomeChosenExplicit, y = percentage, group = AgeConditionPlot, color = AgeConditionPlot, shape = AgeConditionPlot)) +
  #geom_line() +
  geom_point(size = 5, alpha = 1) +
  theme_classic() +
  #theme(axis.title.x = element_blank()) +
  theme(axis.title.x = element_text(size = 25)) +
  theme(axis.title.y = element_text(size = 25)) +
  theme(axis.text = element_text(size = 25)) +
  theme(axis.text.x = element_text(colour = "black")) +
  theme(axis.text.y = element_text(colour = "black")) +
  theme(legend.text = element_text(size=25), legend.title = element_text(size=25), legend.position = "bottom") +
  labs(shape = "Age group") +
  labs(color = "Age group") +
  ylab("Percentage observations forgone deck checked") +
  xlab("\nOutcome experienced") +
  ggtitle("Safer deck") +
  theme(plot.title = element_text(size = 25, hjust = 0.5),
        #legend.position = c(0.85,0.12)) +
        legend.position = "bottom",
        legend.spacing.x = unit(0.1, 'cm')) +
  guides(color = guide_legend(title = "Age group:   ")) +
  guides(shape = guide_legend(title = "Age group:   ")) +
  theme(axis.title.y = element_text(colour = "white")) +
  scale_y_continuous(limits = c(0,75), expand = c(0, 0)) +
  
  scale_color_manual(labels=c('Younger adults  ', 'Older adults'), values=c("#0099B499", "#AD002AFF")) +
  scale_shape_manual(labels=c('Younger adults  ', 'Older adults'), values=c(15, 16)) +
  
  theme(text=element_text(family = "Times New Roman")) +
  
  geom_text(x=1 +xdisplace, y=CLDSafe$percentage[1] +ydisplace, 
            label=paste(CLD2$n[2]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=2 +xdisplace, y=CLDSafe$percentage[2]+ydisplace, 
            label=paste(CLD2$n[4]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=3 +xdisplace, y=CLDSafe$percentage[3]+ydisplace, 
            label=paste(CLD2$n[6]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=4 +xdisplace, y=CLDSafe$percentage[4]+ydisplace, 
            label=paste(CLD2$n[7]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=5 +xdisplace, y=CLDSafe$percentage[5]+ydisplace, 
            label=paste(CLD2$n[9]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=1 +xdisplace, y=CLDSafe$percentage[6]+ydisplace, 
            label=paste(CLD2$n[12]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=2 +xdisplace, y=CLDSafe$percentage[7]+ydisplace, 
            label=paste(CLD2$n[14]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=3 +xdisplace, y=CLDSafe$percentage[8]+ydisplace, 
            label=paste(CLD2$n[16]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=4 +xdisplace, y=CLDSafe$percentage[9]+ydisplace, 
            label=paste(CLD2$n[17]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=5 +xdisplace, y=CLDSafe$percentage[10]+ydisplace, 
            label=paste(CLD2$n[19]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T)
  
  
g1


g2 <- ggplot(CLDRisky, aes(x = OutcomeChosenExplicit, y = percentage, group = AgeConditionPlot, color = AgeConditionPlot, shape = AgeConditionPlot)) +
  #geom_line() +
  geom_point(size = 5, alpha = 1) +
  theme_classic() +
  #theme(axis.title.x = element_blank()) +
  theme(axis.title.x = element_text(size = 25)) +
  theme(axis.title.y = element_text(size = 25)) +
  theme(axis.text = element_text(size = 25)) +
  theme(axis.text.x = element_text(colour = "black")) +
  theme(axis.text.y = element_text(colour = "black")) +
  theme(legend.text = element_text(size=25), legend.title = element_text(size=25), legend.position = "bottom") +
  labs(shape = "Age group") +
  labs(color = "Age group") +
  ylab("Percentage observations forgone deck checked\n") +
  xlab("\nOutcome experienced") +
  ggtitle("Riskier deck") +
  theme(plot.title = element_text(size = 25, hjust = 0.5)) +
  theme(legend.position = "bottom",
        legend.spacing.x = unit(0.1, 'cm')) +
  guides(color = guide_legend(title = "Age group:   ")) +
  guides(shape = guide_legend(title = "Age group:   ")) +
  scale_y_continuous(limits = c(0,75), expand = c(0, 0)) +
  
  scale_color_manual(labels=c('Younger adults  ', 'Older adults'), values=c("#0099B499", "#AD002AFF")) +
  scale_shape_manual(labels=c('Younger adults  ', 'Older adults'), values=c(15, 16)) +
  
  theme(text=element_text(family = "Times New Roman")) + 
  
  geom_text(x=1 +xdisplace, y=CLDRisky$percentage[1]+ydisplace, 
            label=paste(CLD2$n[1]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=2 +xdisplace, y=CLDRisky$percentage[2]+ydisplace, 
            label=paste(CLD2$n[3]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=3 +xdisplace, y=CLDRisky$percentage[3]+ydisplace, 
            label=paste(CLD2$n[5]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=4 +xdisplace, y=CLDRisky$percentage[4]+ydisplace, 
            label=paste(CLD2$n[8]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=5 +xdisplace, y=CLDRisky$percentage[5]+ydisplace, 
            label=paste(CLD2$n[10]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=1 +xdisplace, y=CLDRisky$percentage[6]+ydisplace, 
            label=paste(CLD2$n[11]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=2 +xdisplace, y=CLDRisky$percentage[7]+ydisplace, 
            label=paste(CLD2$n[13]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=3 +xdisplace, y=CLDRisky$percentage[8]+ydisplace, 
            label=paste(CLD2$n[15]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=4 +xdisplace, y=CLDRisky$percentage[9]+ydisplace, 
            label=paste(CLD2$n[18]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T) +
  
  geom_text(x=5 +xdisplace, y=CLDRisky$percentage[10]+ydisplace, 
            label=paste(CLD2$n[20]), family = "Times New Roman", color = "black", size = fontsize, check_overlap = T)

g2

gcomp <- grid.arrange(g2, g1, ncol = 2)

ggsave(filename = "Exp2_1a.tiff", plot = gcomp, width = 15, height = 8, device='tiff', dpi=300)





# ++++++++++ SUPPLEMENTARY MATERIALS ++++++++++ ----


# ******** Counterfactual curiosity - Covariates ******** ----

# GLMM - Round as covariate ----

# Set deviation (aka effect) coding (for tips on interpretation, see
# https://stats.oarc.ucla.edu/other/mult-pkg/faq/general/faq-how-do-i-interpret-the-coefficients-of-an-effect-coded-variable-involved-in-an-interaction-in-a-regression-model/#effect-coding-for-categorical-predictors-with-3-or-more-levels)

dataGLMM_Exp2$AgeCondition <- factor(dataGLMM_Exp2$AgeCondition, levels = c("1", "0"))
contrasts(dataGLMM_Exp2$AgeCondition) = contr.sum(2)

dataGLMM_Exp2$OutcomeChosenExplicit = factor(dataGLMM_Exp2$OutcomeChosenExplicit, levels = c("-60", "-30", "-20", "-10", "0Risky", "0Safe", "10", "20", "30", "60"))
contrasts(dataGLMM_Exp2$OutcomeChosenExplicit) = contr.sum(10)

dataGLMM_Exp2$CenteredRound = dataGLMM_Exp2$Round - mean(dataGLMM_Exp2$Round)

glmm <- glmer(CheckedForgone ~ AgeCondition * OutcomeChosenExplicit + CenteredRound + (1 | Participant),
              data = dataGLMM_Exp2,
              family = binomial(link="logit"),
              control = glmerControl(optimizer = "bobyqa"),
              nAGQ = 1)


# Check assumptions
# https://cran.r-project.org/web/packages/DHARMa/vignettes/DHARMa.html
simulationOutput <- simulateResiduals(fittedModel = glmm, plot = F, n = 10000)
qqnorm(residuals(simulationOutput, quantileFunction = qnorm, outlierValues = c(-7,7)), pch = 1, frame = FALSE)
plotQQunif(simulationOutput)
plotResiduals(simulationOutput)


summary(glmm)
Anova(glmm, type = "III")

exp(fixef(glmm))
exp(confint.merMod(glmm, method = "Wald"))

# Post-hoc with bonferroni adjustment 
emmeans(glmm, pairwise~AgeCondition, type = "response", adjust="bonferroni")
emmeans(glmm, pairwise~OutcomeChosenExplicit, type = "response", adjust="bonferroni")



# GLMM - Index consecutive outcomes as covariate ----

# Set deviation (aka effect) coding (for tips on interpretation, see
# https://stats.oarc.ucla.edu/other/mult-pkg/faq/general/faq-how-do-i-interpret-the-coefficients-of-an-effect-coded-variable-involved-in-an-interaction-in-a-regression-model/#effect-coding-for-categorical-predictors-with-3-or-more-levels)

dataGLMM_Exp2$AgeCondition <- factor(dataGLMM_Exp2$AgeCondition, levels = c("1", "0"))
contrasts(dataGLMM_Exp2$AgeCondition) = contr.sum(2)

dataGLMM_Exp2$OutcomeChosenExplicit = factor(dataGLMM_Exp2$OutcomeChosenExplicit, levels = c("-60", "-30", "-20", "-10", "0Risky", "0Safe", "10", "20", "30", "60"))
contrasts(dataGLMM_Exp2$OutcomeChosenExplicit) = contr.sum(10)

dataGLMM_NoFirstRound = dataGLMM_Exp2[!(dataGLMM_Exp2$Round == 1),]

dataGLMM_NoFirstRound$CenteredOutcomeIndex = dataGLMM_NoFirstRound$OutcomeIndex - mean(dataGLMM_NoFirstRound$OutcomeIndex)

glmm <- glmer(CheckedForgone ~ AgeCondition * OutcomeChosenExplicit + CenteredOutcomeIndex + (1 | Participant),
              data = dataGLMM_NoFirstRound,
              family = binomial(link="logit"),
              control = glmerControl(optimizer = "bobyqa"),
              nAGQ = 1)


# Check assumptions
# https://cran.r-project.org/web/packages/DHARMa/vignettes/DHARMa.html
simulationOutput <- simulateResiduals(fittedModel = glmm, plot = F, n = 10000)
qqnorm(residuals(simulationOutput, quantileFunction = qnorm, outlierValues = c(-7,7)), pch = 1, frame = FALSE)
plotQQunif(simulationOutput)
plotResiduals(simulationOutput)


summary(glmm)
Anova(glmm, type = "III")

exp(fixef(glmm))
exp(confint.merMod(glmm, method = "Wald"))


# Post-hoc with bonferroni adjustment 
emmeans(glmm, pairwise~AgeCondition, type = "response", adjust="bonferroni")
emmeans(glmm, pairwise~OutcomeChosenExplicit, type = "response", adjust="bonferroni")



# ******** Logistic regression - Round selected for the bonus ******** ----

# Set deviation (aka effect) coding (for tips on interpretation, see
# https://stats.oarc.ucla.edu/other/mult-pkg/faq/general/faq-how-do-i-interpret-the-coefficients-of-an-effect-coded-variable-involved-in-an-interaction-in-a-regression-model/#effect-coding-for-categorical-predictors-with-3-or-more-levels)

data_Exp2$AgeCondition = factor(data_Exp2$AgeCondition, levels = c("1", "0"))
contrasts(data_Exp2$AgeCondition) = contr.sum(2)

data_Exp2$OutcomeChosen0Explicit_SelectedRound<-factor(data_Exp2$OutcomeChosen0Explicit_SelectedRound, levels = c("-60", "-30", "-20", "-10", "0Risky", "0Safe", "10", "20", "30", "60"))
contrasts(data_Exp2$OutcomeChosen0Explicit_SelectedRound)<-contr.sum(10)

logReg <- glm(CheckedForgone_SelectedRound ~ AgeCondition * OutcomeChosen0Explicit_SelectedRound, 
              data = data_Exp2, family = binomial())

summary(logReg)
Anova(logReg, type = "III")

exp(logReg$coefficients)
exp(confint(logReg))


CLD <- data_Exp2 %>%
  group_by(AgeCondition, OutcomeChosen0Explicit_SelectedRound, CheckedForgone_SelectedRound) %>%
  summarise(
    n = n()) %>%
  mutate(percentage = n / sum(n))


# Function to compute various R2 measures for logistic regression ----
# See Field, A., Miles, J., Field, Z. Discovering Statistics Using R (pp. 334) 
logisticPseudoR2s <- function(LogModel) {
  dev <- LogModel$deviance
  nullDev <- LogModel$null.deviance
  modelN <- length(LogModel$fitted.values)
  R.l <- 1 - dev / nullDev
  R.cs <- 1- exp ( -(nullDev - dev) / modelN)
  R.n <- R.cs / ( 1 - ( exp (-(nullDev / modelN))))
  cat("Pseudo R^2 for logistic regression\n")
  cat("Hosmer and Lemeshow R^2 ", round(R.l, 3), "\n")
  cat("Cox and Snell R^2 ", round(R.cs, 3), "\n")
  cat("Nagelkerke R^2 ", round(R.n, 3), "\n")
}

logisticPseudoR2s(logReg)

# Assumption checks

# As suggested in Field, A., Miles, J., Field, Z.
# Discovering Statistics Using R (pp. 338-345)

# >>> Linearity with logit

# Main predictors (AgeCondtion and OutcomeChosen0Explicit_SelectedRound) are not continuous, 
# therefore for this model the linearity assumption was not tested

# >>> Influential cases

model.data <- augment(logReg) %>% 
  mutate(index = 1:n())

model.data %>%                        # Influential data points are those with std residuals > 3
  filter(abs(.std.resid) > 3)

# No data points with std residuals > 3 --> OK

# >>> Multicollinearity

car::vif(logReg)         

# No variable with VIF > 5 --> OK






