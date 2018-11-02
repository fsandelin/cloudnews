# only run from /hooks directory
chmod +x ./commit-msg
ln -sf ../../hooks/commit-msg ../.git/hooks/commit-msg
