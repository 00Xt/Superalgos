![Superalgos video capture (16)](https://user-images.githubusercontent.com/9479367/77251218-76d25980-6c4d-11ea-8e47-be7db2e8abdb.gif)

# Quick Getting Started Guide

All procedures are the same for Windows, Linux or Mac OS. Note: only tested with Google Chrome.

## Installation

### Pre-Requisites

#### 1. Nodejs

If you don't have it yet, download and install Node.js.

Please install Node JS, an open-source server environment required to run Superalgos.

a. Go to the Node JS [download page](https://nodejs.org/en/download/).
b. Download your system’s installer. Select LTS Recommended for Most Users and click the big Windows or MacOS Installer button. If you are on Linux, the installer is listed further down.
c. Run the installer with the default configuration—just click Next until Node.JS is fully installed.

#### 2. Git

If you don't have it yet, download and install Git.

Please install Git, an open-source distributed version control system required to download and stay up to date with Superalgos.

a. Go to the Git [download page](https://git-scm.com/downloads).
b. Download the version for your Operating System
c. Run the installer and go through the process until Git is fully installed.

#### 3. Google Chrome

Use Chrome, the Only Tested Browser.

a. Go to the Chrome [download page](https://www.google.com/chrome/).
b. Run the installer.

Before you begin, it is highly recommended that you install Chrome and set it up as your default browser (if you don't already have it).

*Important:* Use Chrome so that you have a similar environment as the dev team in case you need help. We are not testing on any other browsers, and it is a well-known fact that browsers behave differently.

### App Setup

1. If you are not already here, goto to: [https://github.com/Superalgos/Superalgos](https://github.com/Superalgos/Superalgos)
2. At the up-right corner of this page, press the fork button to create your own fork / copy of this repository.
3. At the page of your fork, copy the URL from your browser address bar.
4. At your computer / laptop / server, open a command prompt or terminal as an administrator and start typing:

```
git clone 
```

5. Paste the URL of your fork to complete the git clone command.

```
git clone + URL of your Fork of Superalgos.
```

6. For example, if your Github username is John, the command will look like this:

```
git clone https://github.com/John/Superalgos
```

### Notes

1. You need to make a fork in order for the App functionality that facilitates contributions to work.
2. You need to run the command git clone as an administrator in order to avoid permission problems while creating the Superalgos folder and downloading the repository there. It might also work without admin power, depending on your setup. 

## Usage

1. Run the Superalgos Client doing this: change to the Superalgos directory / folder and type:

```
node run
```

2. The UI will be loaded at your default browser. Be patient it make take a minute to fully load.
3. A Welcome Tutorial will automatically pop-up. You need to do this Tutorial to finish the setup and to learn the basics. It's the ultimate onboarding experience, superior to all other resources available, including videos and the docs.

### Notes

1. We have only tested the UI with Google Chrome. It might work with other browsers as well, or it might not.
2. Before installing the client in a different hardware that from where you are going to load the UI, we reccomend you to first do a standard installation at your PC / laptop, and leave your Raspberry Pi or Server for after you have done all available tutorials. This single tip will save you a lot of time. 

## Uninstall

Superalgos does not write anything outside the Superalgos's folder. To completelly uninstall the software, just delete the Superalgos's folder. 

## Welcome Tutorial

Once the app finishes loading, an interactive tutorial takes you by the hand and walks you all around the system while you learn the basic skills required to use the interface, mine data, backtest strategies, and even run a live trading session. It is highly recommended you follow the tutorial until the end, as it is carefully crafted to make your onboarding as easy as possible. In fact, tutorials are the absolute best way to tackle the learning curve. You should do all tutorials before you start exploring other avenues on your own.

## Full Instalation Guide

If you need more detailed, step-by-step instructions on how to install Superalgos, find them at the [Documentation Site](https://docs.superalgos.org/suite-download-and-set-up.html)

## Docker Deployments

We haven't tested containerized deployments, but many people in the community have. Worth noting is the fact that Superalgos doesn't touch anything outside the Superalgos folder. To uninstall, delete the folder.

# What is Superalgos?

Superalgos is a platform to automate crypto-trading. It is implemented as a Nodejs Client + Web App that runs on your hardware and scales from a single Raspberry Pi to a Trading Farm. Superalgos is **Free** and **Open Source**.

## Superalgos Features

* A Visual Scripting Designer.
* Integrated Charting System.
* A Visual Strategy Debugger.
* Task Management across a Trading Farm.
* Community built strategies to learn and start from.
* In-App Tutorials
* Complete Documentation

## Superalgos allows you to

* Visually design your own trading strategies.
* Visually debug your trading strategies.
* Visually design your own indicators.
* Visually design your own plotters (to visualize indicators or data mined).
* Visually design your data-mining operations.
* Download historical market data from crypto exchanges.
* Backtest your strategies against historical data.
* Run live trading sessions.
* Run arbitrary data-mining operations of any size.
* Feed your trading strategies with the data mined.

## Superalgos Development Pipeline

* Ethereum Integration, which will allow you to data mine your own Ethereum node and use the mined data in your strategies.
* Machine Learning, which will allow you to run a Reinforcement Learning Algorithm and feed it with mined data so as to learn how to take decisions relevant for your strategies.

## Superalgos is user-centric

* No ads, anywhere.
* No sign up / logins.
* No user / usage data collection of any kind.
* Runs 100% on uncompiled code anyone can read and audit.

# Superalgos for Developers

* You are free to customize Superalgos for your customers. No royalties, no license fees.
* Everything extra your customers might need you can code it yourself or request it as new features.
* You can use Superalgos as a platform or a component of a larger system.
* No proprietary code / libraries. All open source and free.
* Already available a set of community-contributed plugins (workspaces, strategies, indicators, plotters, tutorials, etc.).

## Superalgos saves you time

* No need to code the download of historical data from crypto exchanges.
* No need to code the streaming of market data from crypto exchanges.
* No need to hardcode strategies, use the visual designer for a more flexible approach.
* No need to debug what went wrong line by line or diving into log files with tons of data. You can see each variable of the state of the Trading Engine at every candle by hovering the mouse over the charts.
* No need to integrate a charting library, Superalgos has its own integrated Charting System.
* No need to manage task data or execution dependencies by yourself. Superalgos allows you to define Tasks and distribute them across a Trading Farm, and it takes care of the data and execution dependencies, so that each task automatically starts when their dependencies are ready.

# Superalgos for Individuals

* Superalgos is easy to install / uninstall.
* Superalgos is easy to run.
* Superalgos is easy to use.
* Superalgos is easy to learn.
* Superalgos is easy to debug.
* Superalgos is well documented.
* You have free online support via Telegram.

## Superalgos saves you money

* There are no paid plans or anything that costs you money.
* There is no locked functionality, you can use the full capacity of the software.
* There is no limit in the number of backtests you can run. 
* There is no limit in the number of live sessions you can run.
* There is no limit in the number of historical data you can download.
* There is no limit in the number of data you can process.
* You can use all the plugins available (indicators / plotters / strategies / etc.)
* You can install Superalgos in as many machines as you want.
* Your installations can be used by as many people as you want.
* You can connect to as many crypto exchanges as you want.

## Superalgos minimizes your risks

* No one can know what strategies you design / run.
* No one can front-run you.
* No one can steal your trading ideas.
* No one knows how much money you have / trade.
* No one can see your exchange keys.

# Superalgos for Companies

* No need to buy expensive software for monitoring crypto markets or trading execution.
* All your employees can use Superalgos for free.
* You can use Superalgos at its full capacity or just the features you are currently interested in.
* Superalgos could be integrated into your existing operation, feeding itself from other systems or feeding other systems as well.

# Support

## Via Telegram

Online support through our [Superalgos User's Support Group](https://t.me/superalgossupport).
 
## Via Documentation Site

Self service support available via the [Superalgos Documentation Site](https://docs.superalgos.org/).

## Via Video Tutorials

Self service support via video tutorials at the [Superalgos YouTube Channel](https://www.youtube.com/channel/UCmYSGbB151xFQPNxj7KfKBg).

# Other Resources

## Web Site

For an overview of what Superalgos can do for you, please check the [Superalgos Website](https://superalgos.org/).

## Telegram

Meet other users at our [Superalgos Telegram Community Group](https://t.me/superalgoscommunity).

Meet the developers at our [Superalgos Telegram Developer's Group](https://t.me/superalgosdevelop).

Spanish speaking users hang out at our [Superalgos en Español Telegram Group](https://t.me/superalgos_es).

## Blog

You can find official announcements and various articles on the [Superalgos Blog](https://medium.com/superalgos).

## Twitter

To stay up-to-date, follow [Superalgos on Twitter](https://twitter.com/superalgos).

## Facebook

To stay up-to-date, follow [Superalgos on Facebook](https://www.facebook.com/superalgos).

# Contributing

Superalgos is a Community Project built by Contributors. Learn [how to become a Contributor](https://docs.superalgos.org/contributing-to-superalgos.html).

## Contributors 

Luis Fernando Molina, Julian Molina, Andreja Cobeljic, Matías Benitez, Ira Miller, Eduardo Remis, Jeff Braun, rico4dev, 9808us, Barry Low, Nikola Bjelogrlic, Hirajin Koizuko, Francisco J. Santillán, Viktoria B., Guillermo V., Daniel J., Javier A., Gustavo J., Romina GS, Pedro P., Thais M., Andrey M., Loui M., Natalia M., Bashar A., Carlos V., Diego M., Sebastian E., Bogdan P., Marko V., Igor S., Niksa K., Rodrigo M., Nicanor M., Alejandro P., Mateo H., Lan T., Leon A., Uroš R., Filip M., Vladimir J. and Pavle B.

# License

Superalgos is open-source software released under [Apache License 2.0](LICENSE).




