new-account -n miner_0_account
new-account -n miner_1_account
new-account -n miner_2_account
new-account -n miner_3_account
new-account -n miner_4_account
new-account -n miner_5_account
import-account 0936af475d2701538aad321f87e0a51f2b297634653393e8cab7290a674009a5 -n prefunded
eth-transfer miner_0_account 1eth
eth-transfer miner_1_account 1eth
eth-transfer miner_2_account 1eth
eth-transfer miner_3_account 1eth
eth-transfer miner_4_account 1eth
eth-transfer miner_5_account 1eth
deploy-algotoken -n token
deploy-algominer 1 0 miner_0_account token -n miner_0
deploy-algominer 1 1 miner_1_account token -n miner_1
deploy-algominer 1 2 miner_2_account token -n miner_2
deploy-algominer 1 3 miner_3_account token -n miner_3
deploy-algominer 1 4 miner_4_account token -n miner_4
deploy-algominer 1 5 miner_5_account token -n miner_5
token.algotoken-transfer miner_0 1m
token.algotoken-transfer miner_1 1m
token.algotoken-transfer miner_2 1m
token.algotoken-transfer miner_3 1m
token.algotoken-transfer miner_4 1m
token.algotoken-transfer miner_5 1m
miner_0.algominer-activateminer
miner_1.algominer-activateminer
miner_2.algominer-activateminer
miner_3.algominer-activateminer
miner_4.algominer-activateminer
miner_5.algominer-activateminer
set-account miner_0_account
miner_0.algominer-startmining
set-account miner_1_account
miner_1.algominer-startmining
set-account miner_2_account
miner_2.algominer-startmining
set-account miner_3_account
miner_3.algominer-startmining
set-account miner_4_account
miner_4.algominer-startmining
set-account miner_5_account
miner_5.algominer-startmining
set-account prefunded
deploy-algofees token -n fees1
token.algotoken-transfer fees1 151eth
token.algotoken-balanceof fees1
fees1.algofees-registerminer miner_0
fees1.algofees-registerminer miner_1
fees1.algofees-registerminer miner_2
fees1.algofees-registerminer miner_3
fees1.algofees-registerminer miner_4
fees1.algofees-registerminer miner_5
fees1.algofees-mine
token.algotoken-balanceof miner_0_account
token.algotoken-balanceof miner_1_account
token.algotoken-balanceof miner_2_account
token.algotoken-balanceof miner_3_account
token.algotoken-balanceof miner_4_account
token.algotoken-balanceof miner_5_account
